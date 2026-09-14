// Node 실행용 래퍼. GitHub Actions에서 `node board/build-board.mjs` 로 실행합니다.
// 입력: board/govbiz-screens.js (화면 데이터)
// 출력: public-board/ (프레임 27개 HTML) → GitHub Pages로 배포
import { readFile as fsRead, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const HERE = import.meta.dirname;
const ROOT = resolve(HERE, '..');
const OUT_DIR = resolve(ROOT, 'public-board');

async function readFile(p) {
  return fsRead(resolve(HERE, p), 'utf8');
}

async function saveFile(p, data) {
  const out = resolve(OUT_DIR, p.replace(/^figma-frames\//, ''));
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, data, 'utf8');
}

const log = (...a) => console.log(...a);

const { build } = await import(resolve(HERE, 'build-frames.js'));
await build({ readFile, saveFile, log });

// 프레임 목록 색인 페이지 — Figma 임포트할 때 주소를 한곳에서 복사
const files = (await readdir(OUT_DIR)).filter((f) => f.endsWith('.html') && f !== 'index.html').sort();
const rows = files.map((f) => `<li style="padding:9px 0;border-top:1px solid #e3e5e8;display:flex;gap:12px;align-items:baseline">
<span style="font-family:ui-monospace,monospace;font-size:12px;font-weight:700;color:#fff;background:#202124;border-radius:5px;padding:3px 8px">${f.slice(0, 2)}</span>
<a href="./${f}" style="font-size:14px;font-weight:700;color:#087f46;text-decoration:none">${f.replace('.html', '')}</a></li>`).join('\n');

await writeFile(resolve(OUT_DIR, 'index.html'), `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><title>GovBiz 화면별 관리 보드 · 프레임 목록</title>
<style>body{margin:0;background:#f5f6f7;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;word-break:keep-all}</style></head>
<body><div style="max-width:760px;margin:0 auto;padding:40px 24px 72px">
<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;letter-spacing:-0.04em">GovBiz 화면별 관리 보드</h1>
<p style="margin:0 0 24px;font-size:13.5px;line-height:1.8;color:#606770">Figma 임포트용 프레임 ${files.length}개입니다. 각 링크 주소를 html.to.design 또는 Builder.io의 <strong>URL 임포트</strong>에 붙여넣으세요. 데이터가 갱신될 때마다 이 페이지도 자동으로 다시 만들어집니다.</p>
<p style="margin:0 0 24px;font-size:12.5px;line-height:1.8;color:#606770;background:#fff;border:1px solid #e3e5e8;border-radius:12px;padding:14px 16px">임포트 후 프레임 이름이 <code>01-</code> ~ <code>27-</code> 로 시작하는지 확인하고, 자동 연결 플러그인을 실행하면 사이드바 탭이 모두 연결됩니다.</p>
<ul style="list-style:none;margin:0;padding:0">${rows}</ul>
<p style="margin:28px 0 0;font-family:ui-monospace,monospace;font-size:11px;color:#838a93">generated ${new Date().toISOString()}</p>
</div></body></html>
`, 'utf8');

log('index.html written with ' + files.length + ' frames');
