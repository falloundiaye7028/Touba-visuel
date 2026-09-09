import {writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {makeHash} from '../lib/password.mjs';
const password=randomBytes(24).toString('base64url');
writeFileSync('.admin-credentials.local',`Mot de passe administrateur: ${password}\nADMIN_PASSWORD_HASH=${makeHash(password)}\n`,{mode:0o600,flag:'wx'});
console.log('Identifiants créés dans .admin-credentials.local (fichier privé, non versionné).');
