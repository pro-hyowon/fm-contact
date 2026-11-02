/* 릴리스에 붙인 update.fmu 확인: 제작자 서명이 맞고, 릴리스 태그와 버전·주소가 같아야 main에 올림 */
const fs = require('fs'); const crypto = require('crypto');
const PUB = 'VkuS3/AEvDKXY4NmuP1mm+A0190cjUOHhkuiBPA0sGk=';
const [, , file, tag] = process.argv; const t = fs.readFileSync(file, 'utf8').trim();
const m = t.match(/^FMU1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9+/=]+)$/); if (!m) { console.error('update.fmu 모양이 아님'); process.exit(1); }
const js = Buffer.from(m[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
const key = crypto.createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(PUB, 'base64')]), format: 'der', type: 'spki' });
if (!crypto.verify(null, Buffer.from('FM-UPDATE|' + js), key, Buffer.from(m[2], 'base64'))) { console.error('서명이 맞지 않음 — 올리지 않음'); process.exit(1); }
const u = JSON.parse(js); const ver = String(tag || '').replace(/^v/, '');
if (u.ver !== ver) { console.error(`버전이 다름: 알림 ${u.ver} / 릴리스 ${ver}`); process.exit(1); }
if (u.url !== `https://github.com/pro-hyowon/fm-contact/releases/download/v${ver}/FolderManager_v${ver}.zip`) { console.error('파일 주소가 맞지 않음'); process.exit(1); }
console.log(`확인됨: v${u.ver} · ${u.size} bytes · ${u.sha256.slice(0, 16)}…`);
