import { failure, isIdentification, pathPrefix, timeout, } from "./shared.js";
let loading;
function load(url, timeoutMs) {
    if (loading) {
        return loading.url === url
            ? loading.promise
            : Promise.reject(new Error("conflicting_configuration"));
    }
    const promise = new Promise((resolve, reject) => {
        if (window.heedeo) {
            reject(new Error("existing_collector"));
            return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        const timer = setTimeout(() => finish(false), timeoutMs);
        function finish(ok) {
            clearTimeout(timer);
            script.onload = null;
            script.onerror = null;
            if (ok && window.heedeo)
                resolve();
            else {
                script.remove();
                reject(new Error("script_unavailable"));
            }
        }
        script.onload = () => finish(true);
        script.onerror = () => finish(false);
        document.head.append(script);
    });
    loading = { url, promise };
    void promise.catch(() => {
        if (loading?.promise === promise)
            loading = undefined;
    });
    return promise;
}
/** Create once per app. Calling this function alone makes no identification request. */
export function createHeedeo(options) {
    if (!options.publishableKey?.startsWith("pk_"))
        throw new Error("Use a Heedeo publishable key in the browser.");
    if (options.path !== undefined && options.endpoint !== undefined)
        throw new Error("Give Heedeo either path or endpoint, not both.");
    const publishableKey = options.publishableKey;
    // A host on your domain that serves Heedeo, such as https://www.customer.com/k9m2x: an HTTPS
    // origin and at most one path segment, which the script and identify sit under.
    const endpoint = options.endpoint ?? null;
    if (endpoint !== null &&
        (!/^https:\/\/[^/?#]+(\/[a-zA-Z0-9_-]+)?$/.test(endpoint) || !URL.canParse(endpoint)))
        throw new Error("Heedeo endpoint must be an HTTPS origin with one optional path segment.");
    const path = pathPrefix(options.path ?? "/hd");
    const budget = timeout(options.timeoutMs ?? 3000);
    return {
        async identify() {
            if (typeof window === "undefined")
                return failure("browser_required", "Call identify in a browser action handler.");
            let timer;
            const deadline = new Promise((resolve) => {
                timer = setTimeout(() => resolve(failure("timeout", "Identification timed out. Continue without signals.")), budget);
            });
            const identify = async () => {
                try {
                    const url = new URL(`${endpoint ?? window.location.origin + path}/i.js`);
                    url.searchParams.set("key", publishableKey);
                    await load(url.href, budget);
                    const data = await window.heedeo?.identify();
                    return isIdentification(data)
                        ? { data, error: null }
                        : failure("invalid_response", "Identification returned an unexpected response.");
                }
                catch {
                    return failure("identification_unavailable", "Check the public key and proxy route. Continue signup without signals.");
                }
            };
            try {
                return await Promise.race([identify(), deadline]);
            }
            finally {
                clearTimeout(timer);
            }
        },
    };
}
