import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeHash,verifyPassword} from '../lib/password.mjs';
test('password hashing rejects invalid passwords and malformed hashes',()=>{const hash=makeHash('test-password-only-not-a-real-credential');assert.equal(verifyPassword('test-password-only-not-a-real-credential',hash),true);assert.equal(verifyPassword('wrong',hash),false);assert.equal(verifyPassword('x','malformed'),false);assert.equal(verifyPassword('x'.repeat(257),hash),false);});
