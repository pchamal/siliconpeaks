import test from 'node:test';
import assert from 'node:assert/strict';
import {searchTemplateTarget} from '../src/search-template.mjs';
const apex='https://siliconpeaks.com';
test('a leaked SearchAction template redirects to the same path without a query',()=>{
 assert.equal(searchTemplateTarget(apex+'/?q={search_term_string}'),apex+'/');
 assert.equal(searchTemplateTarget(apex+'/?q=%7Bsearch_term_string%7D'),apex+'/');
 assert.equal(searchTemplateTarget(apex+'/?q=%257Bsearch_term_string%257D'),apex+'/');
 assert.equal(searchTemplateTarget(apex+'/companies/?q={search_term_string}'),apex+'/companies/');
 assert.equal(searchTemplateTarget(apex+'/companies/?utm=newsletter&q={Search_Term_String}#list'),apex+'/companies/');
 assert.equal(searchTemplateTarget(apex+'/?q=software'),null);
 assert.equal(searchTemplateTarget(apex+'/companies/'),null);
 assert.equal(searchTemplateTarget(apex+'/?utm_source=newsletter'),null);
});
