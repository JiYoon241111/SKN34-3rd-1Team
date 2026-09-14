// figma-frames 27개 생성기. run_script에서:
//   const {build} = await import('./build-frames.js'); await build({readFile, saveFile, ls, log});
export async function build({ readFile, saveFile, log }) {
  const src = await readFile('govbiz-screens.js');
  const S = new Function(src.replace('export const screens', 'const screens') + '\nreturn screens;')();
  S.forEach((s) => { s.file = s.no + '-' + s.key; });

  const chips = { live: 'background:#e7f6ed;color:#087f46', part: 'background:#fff4e0;color:#8a5a00', gap: 'background:#fff5f6;color:#9a3947' };
  const dots = { live: '#087f46', part: '#e0b357', gap: '#c9636f' };
  const prioStyle = { P0: 'background:#9a3947;color:#fff', P1: 'background:#fff4e0;color:#8a5a00', P2: 'background:#f1f2f3;color:#606770' };
  const prioRank = { P0: 0, P1: 1, P2: 2 };
  const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const mono = "font-family:'JetBrains Mono',monospace";
  const cnt = (t) => S.reduce((n, s) => n + s.elements.filter((e) => e.tone === t).length, 0);
  const allN = S.reduce((n, s) => n + s.history.length, 0);
  const OWN = [['홍지윤', '19'], ['김건우', '24'], ['김동섭', '25'], ['송승재', '26'], ['이성민', '27']];
  const ownerOpen = (nm) => S.filter((s) => s.owner === nm).reduce((n, s) => n + s.elements.filter((e) => e.tone !== 'live').length, 0);
  const planN = S.reduce((n, s) => n + (s.questions ? s.questions.length : 0), 0);
  const ICON = { 17: '✎', 18: '✦', 20: '◔' };
  const DDAY = 'D-3';

  function sidebar(cur) {
    const nr = (no, name, act, tone) => `<div style="display:flex;align-items:center;gap:10px;border-radius:13px;padding:10px 12px;${act ? 'background:#202124;color:#fff' : 'background:#fff;color:#202124'}">
<span style="${ICON[no] ? 'font-size:11px' : mono + ';font-size:10.5px'};opacity:.65;flex:none;width:18px">${ICON[no] || no}</span>
<span style="flex:1;min-width:0;font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(name)}</span>
<span style="flex:none;width:8px;height:8px;border-radius:999px;background:${tone}"></span></div>`;
    const chipRow = OWN.map(([nm, no]) => `<div style="display:inline-flex;align-items:center;gap:5px;border:1px solid ${cur === no ? '#202124' : '#e3e5e8'};border-radius:999px;padding:5px 10px;font-size:11.5px;font-weight:700;white-space:nowrap;${cur === no ? 'background:#202124;color:#fff' : 'background:#fff;color:#202124'}">${esc(nm)}<span style="font-size:10px;font-weight:900;opacity:.7">${nm === '홍지윤' ? 5 : ownerOpen(nm)}</span></div>`).join('');
    let g = ''; let last = '';
    S.forEach((s) => {
      const gr = s.group || '화면';
      if (gr !== last) { g += `<span style="font-size:10px;font-weight:900;letter-spacing:0.1em;color:#838a93;padding:8px 0 2px 6px">${esc(gr)}</span>`; last = gr; }
      g += nr(s.no, s.name, cur === s.no, dots[s.tone]);
    });
    return `<div style="background:#fff;border:1px solid #e3e5e8;border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:13px;align-self:start">
<div style="display:flex;flex-direction:column;gap:9px"><span style="font-size:10.5px;font-weight:900;letter-spacing:0.12em;color:#606770;padding-left:4px">담당자</span>
<div style="display:flex;flex-wrap:wrap;gap:6px">${chipRow}</div></div>
<div style="display:flex;flex-direction:column;gap:5px"><span style="font-size:10.5px;font-weight:900;letter-spacing:0.12em;color:#606770;padding-left:4px">전체</span>
${nr('17', '보드 사용 규칙', cur === '17', '#c9ced3')}${nr('18', '전체 변경 히스토리', cur === '18', '#c9ced3')}${nr('20', '최근 7일 요약', cur === '20', '#087f46')}</div>
<span style="font-size:10.5px;font-weight:900;letter-spacing:0.12em;color:#606770;padding-left:4px">화면 목록</span>
<div style="display:flex;flex-direction:column;gap:5px">${g}</div>
<div style="border-top:1px solid #e3e5e8;padding-top:11px;display:flex;flex-direction:column;gap:5px;padding-left:4px;font-size:11px;color:#606770">
<span style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:999px;background:#087f46"></span>구현 완료</span>
<span style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:999px;background:#e0b357"></span>부분 · 데모</span>
<span style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:999px;background:#c9636f"></span>미구현</span></div></div>`;
  }

  const header = `<div style="background:#fff;border:1px solid #e3e5e8;border-radius:18px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:16px">
<div style="display:flex;align-items:center;gap:11px">
<div style="display:grid;place-items:center;width:26px;height:26px;border-radius:999px;background:#e7f6ed;color:#087f46;font-weight:900;font-size:13px">G</div>
<span style="font-size:17px;font-weight:900;letter-spacing:-0.035em;white-space:nowrap">화면별 관리 보드</span>
<span style="font-size:12px;color:#606770;white-space:nowrap">화면 하나를 한 페이지로 — 비즈니스 · 진행 · 변경 기록</span></div>
<div style="display:flex;align-items:center;gap:8px">
<span style="font-size:11.5px;color:#606770;white-space:nowrap">관리 화면<strong style="font-size:14px;font-weight:900;color:#202124;padding-left:4px">${S.length}</strong></span>
<span style="width:1px;height:16px;background:#e3e5e8"></span>
<span style="display:inline-flex;align-items:baseline;gap:5px;border-radius:999px;background:#e7f6ed;padding:5px 11px;font-size:11.5px;color:#087f46;white-space:nowrap">구현 항목<strong style="font-size:13px;font-weight:900">${cnt('live')}</strong></span>
<span style="display:inline-flex;align-items:baseline;gap:5px;border-radius:999px;background:#fff4e0;padding:5px 11px;font-size:11.5px;color:#8a5a00;white-space:nowrap">부분 항목<strong style="font-size:13px;font-weight:900">${cnt('part')}</strong></span>
<span style="display:inline-flex;align-items:baseline;gap:5px;border-radius:999px;background:#fff5f6;padding:5px 11px;font-size:11.5px;color:#9a3947;white-space:nowrap">미구현 항목<strong style="font-size:13px;font-weight:900">${cnt('gap')}</strong></span>
<span style="display:inline-flex;align-items:baseline;gap:5px;border:1px solid #e3e5e8;border-radius:999px;padding:5px 11px;font-size:11.5px;color:#606770;white-space:nowrap">변경<strong style="font-size:13px;font-weight:900;color:#202124">${allN}</strong></span>
<span style="display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:#fff5f6;color:#9a3947;padding:5px 12px;font-size:11.5px;font-weight:900;white-space:nowrap">${DDAY}<span style="font-weight:600;opacity:.85">단위 프로젝트 발표 · 2026-09-17</span></span></div></div>`;

  const card = (b) => `<div style="background:#fff;border:1px solid #e3e5e8;border-radius:22px;padding:26px 32px;display:flex;flex-direction:column;gap:18px;min-width:0">${b}</div>`;
  const page = (t, body, cur) => `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>${esc(t)}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>body{margin:0;background:#f5f6f7;font-family:'Noto Sans KR',system-ui,sans-serif;word-break:keep-all;overflow-wrap:break-word;-webkit-font-smoothing:antialiased}</style></head><body>
<div style="width:1440px;padding:26px;box-sizing:border-box">${header}
<div style="display:grid;grid-template-columns:288px minmax(0,1fr);gap:20px;align-items:start">${sidebar(cur)}${body}</div></div></body></html>`;

  const shot = (l, n) => `<div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#606770">${l}</span>
<div style="width:100%;height:190px;border-radius:16px;border:1px solid #e3e5e8;background:repeating-linear-gradient(45deg,#f6f7f8,#f6f7f8 8px,#f1f2f3 8px,#f1f2f3 16px);display:grid;place-items:center"><span style="${mono};font-size:11px;color:#838a93">${n}</span></div></div>`;
  const bl = (it, c, m) => it.map((v) => `<div style="display:flex;gap:9px;align-items:flex-start"><span style="flex:none;${mono};font-size:10.5px;font-weight:700;color:${c};margin-top:2px">${m}</span><span style="font-size:12.5px;line-height:1.7">${esc(v)}</span></div>`).join('');
  const eg = (e) => `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px">${e.map((x) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #e3e5e8;border-radius:12px;padding:10px 13px"><span style="font-size:12.5px;font-weight:600;min-width:0">${esc(x.name)}</span><span style="flex:none;border-radius:999px;font-size:10.5px;font-weight:900;padding:3px 9px;white-space:nowrap;${chips[x.tone]}">${esc(x.state)}</span></div>`).join('')}</div>`;
  const hist = (h) => `<div style="display:grid;grid-template-columns:96px 62px minmax(0,1fr) 158px;gap:15px;padding:13px 0;border-top:1px solid #f1f2f3;align-items:start">
<span style="${mono};font-size:12px;font-weight:700;white-space:nowrap">${esc(h.date)}</span><span style="font-size:11.5px;color:#606770;white-space:nowrap">${esc(h.who)}</span>
<div style="display:flex;flex-direction:column;gap:5px;min-width:0"><span style="font-size:13px;line-height:1.6;font-weight:600">${esc(h.what)}</span><span style="${mono};font-size:10.5px;color:#606770">${esc(h.ref)}</span></div>
<div style="width:158px;height:99px;border-radius:10px;border:1px solid #e3e5e8;background:repeating-linear-gradient(45deg,#f6f7f8,#f6f7f8 6px,#f1f2f3 6px,#f1f2f3 12px)"></div></div>`;
  const vh = (t, b, bs, d) => `<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><h3 style="margin:0;font-size:18px;font-weight:900;letter-spacing:-0.035em">${esc(t)}</h3>${b ? `<span style="border-radius:999px;font-size:11.5px;font-weight:900;padding:5px 12px;${bs}">${esc(b)}</span>` : ''}</div>${d ? `<p style="margin:0;font-size:12.5px;line-height:1.8;color:#606770;max-width:780px">${d}</p>` : ''}`;
  const gt = (s) => `<span style="font-size:10.5px;font-weight:700;color:#606770;background:#f1f2f3;border-radius:999px;padding:3px 9px">${esc(s.group)}</span>`;
  const pb = (s) => `<span style="${mono};font-size:11px;font-weight:900;border-radius:5px;padding:3px 9px;${prioStyle[s.prio || 'P2']}">${s.prio || 'P2'}</span>`;
  const sh = (s) => `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">${pb(s)}<span style="${mono};font-size:11px;font-weight:700;color:#fff;background:#202124;border-radius:5px;padding:3px 8px">${s.no}</span><span style="font-size:14px;font-weight:700">${esc(s.name)}</span>${gt(s)}<span style="border-radius:999px;font-size:10.5px;font-weight:900;padding:3px 9px;${chips[s.tone]}">${esc(s.status)}</span><span style="font-size:11.5px;color:#606770">담당 · ${esc(s.owner)}</span>${s.demo ? '<span style="border-radius:999px;background:#202124;color:#fff;font-size:10.5px;font-weight:900;padding:3px 9px">9/17 발표 경로</span>' : ''}<span style="margin-left:auto;border:1px solid #e3e5e8;border-radius:999px;padding:5px 13px;font-size:11.5px;font-weight:700;color:#087f46;white-space:nowrap">화면 열기 →</span></div>`;

  for (const s of S) {
    await saveFile('figma-frames/' + s.file + '.html', page(s.no + ' ' + s.name, card(`<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap">
<div style="flex:1 1 320px;display:flex;flex-direction:column;gap:8px;min-width:0">
<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="${mono};font-size:11px;font-weight:700;color:#fff;background:#202124;border-radius:5px;padding:3px 8px">${s.no}</span>${gt(s)}<span style="${mono};font-size:11px;color:#606770;white-space:nowrap">${esc(s.route)}</span>${s.demo ? '<span style="border-radius:999px;background:#202124;color:#fff;font-size:10.5px;font-weight:900;padding:3px 9px">9/17 발표 경로</span>' : ''}</div>
<h2 style="margin:0;font-size:27px;font-weight:900;letter-spacing:-0.045em">${esc(s.name)}</h2>
<p style="margin:0;font-size:13px;color:#606770">${esc(s.tagline)}</p></div>
<div style="flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:8px">
<div style="display:flex;align-items:center;gap:7px">${pb(s)}<span style="border-radius:999px;font-size:11.5px;font-weight:900;padding:7px 14px;white-space:nowrap;${chips[s.tone]}">${esc(s.status)}</span></div>
<span style="font-size:11.5px;color:#606770;white-space:nowrap">담당 · ${esc(s.owner)}</span>
<span style="${mono};font-size:11px;color:#606770;white-space:nowrap">최근 변경 ${esc(s.lastChanged)}</span></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${shot('현재 구현 화면', 'screenshot / 구현')}${shot('시안 · 목표 화면', 'screenshot / 시안')}</div>
<div style="display:grid;grid-template-columns:1.15fr 1fr;gap:18px">
<div style="border-radius:16px;background:#f6f7f8;padding:20px 22px;display:flex;flex-direction:column;gap:10px;min-width:0"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#606770">BUSINESS · 이 화면이 존재하는 이유</span><p style="margin:0;font-size:13.5px;line-height:1.85">${esc(s.biz)}</p></div>
<div style="border:1px solid #e3e5e8;border-radius:16px;padding:20px 22px;display:flex;flex-direction:column;gap:10px;min-width:0"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#606770">이 화면이 성공했다는 신호</span>${s.value.map((v) => `<div style="display:flex;gap:9px;align-items:flex-start"><span style="flex:none;margin-top:6px;width:5px;height:5px;border-radius:999px;background:#087f46"></span><span style="font-size:12.5px;line-height:1.7">${esc(v)}</span></div>`).join('')}</div></div>
<div style="display:flex;flex-direction:column;gap:11px"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#606770">구성 요소 · 현재 상태</span>${eg(s.elements)}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
<div style="border:1px solid #e3e5e8;border-radius:16px;padding:20px 22px;display:flex;flex-direction:column;gap:11px;min-width:0"><div style="display:flex;align-items:center;gap:9px"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#087f46">다음 변경 예정</span>${pb(s)}</div><p style="margin:0;font-size:12px;line-height:1.75;color:#606770">${esc(s.prioWhy || '')}</p>${bl(s.next, '#087f46', '□')}</div>
<div style="border:1px dashed #e3e5e8;border-radius:16px;background:#fffaf0;padding:20px 22px;display:flex;flex-direction:column;gap:11px;min-width:0"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#8a5a00">결정이 필요한 질문</span>${bl(s.questions, '#8a5a00', '?')}</div></div>
<div style="display:flex;flex-direction:column;gap:11px;border-top:1px solid #e3e5e8;padding-top:20px"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#606770">HISTORY · 이 화면의 변경 기록</span>${s.history.map(hist).join('')}</div>`), s.no));
  }

  const rules = [['01', '화면 = 프레임 하나', '라우트가 늘면 프레임을 추가합니다. 화면을 합치거나 지울 때도 기록만 남기고 프레임은 지우지 않습니다.'], ['02', '변경은 히스토리에만 쌓기', '본문(비즈니스 설명·구성 요소)은 항상 현재 상태로 덮어씁니다. 과거는 히스토리 줄로만 남깁니다.'], ['03', '한 줄에 날짜·사람·근거', '이슈 번호(skn-번호 · #번호)를 근거 칸에 남기면 나중에 "왜 이렇게 됐지"를 되짚을 수 있습니다.'], ['04', '결정되면 질문에서 빼기', '결정 대기 질문이 해결되면 히스토리에 결정 줄을 추가하고 질문에서 지웁니다. 대기 수가 기획 진척도입니다.']];
  await saveFile('figma-frames/17-rules.html', page('17 보드 사용 규칙', card(vh('이 보드를 유지하는 규칙', '', '', '화면이 계속 바뀌는 동안 이 보드가 신뢰를 잃지 않으려면 네 가지만 지키면 됩니다. 새 팀원이 합류하면 이 프레임부터 보여 주세요.') + `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">${rules.map((r) => `<div style="border:1px solid #e3e5e8;border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:7px"><span style="${mono};font-size:18px;font-weight:700;color:#e3e5e8">${r[0]}</span><span style="font-size:13.5px;font-weight:700">${esc(r[1])}</span><p style="margin:0;font-size:12px;line-height:1.8;color:#606770">${esc(r[2])}</p></div>`).join('')}</div>`), '17'));

  const all = [];
  S.forEach((s) => s.history.forEach((h) => all.push({ ...h, screen: s.no + ' ' + s.name, group: s.group })));
  all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const hr = (a) => `<div style="display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;padding:13px 0;border-top:1px solid #f1f2f3;align-items:start">
<span style="${mono};font-size:12px;font-weight:700;padding-top:1px;white-space:nowrap">${esc(a.date)}</span>
<div style="display:flex;flex-direction:column;gap:5px;min-width:0"><span style="font-size:12.5px;line-height:1.6">${esc(a.what)}</span>
<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px"><span style="font-size:10.5px;font-weight:700;color:#606770;background:#f1f2f3;border-radius:999px;padding:3px 9px">${esc(a.group)}</span><span style="font-size:11.5px;font-weight:700;color:#087f46">${esc(a.screen)}</span><span style="font-size:11.5px;color:#606770">${esc(a.who)}</span><span style="${mono};font-size:10.5px;color:#838a93">${esc(a.ref)}</span></div></div></div>`;
  await saveFile('figma-frames/18-history.html', page('18 전체 변경 히스토리', card(vh('전체 변경 히스토리', all.length + '건', 'background:#f1f2f3;color:#606770', '모든 화면 통합 · 최신순 · 커밋과 결정 기준') + `<div style="display:flex;flex-direction:column">${all.map(hr).join('')}</div>`), '18'));
  const wk = all.filter((a) => a.date >= '2026-09-07');
  await saveFile('figma-frames/20-weekly.html', page('20 최근 7일 요약', card(vh('최근 7일 요약', wk.length + '건', 'background:#e7f6ed;color:#087f46', '주간 회의 시작 프레임으로 쓰세요. 2026-09-07 이후 실제로 바뀐 것만 모았습니다.') + `<div style="display:flex;flex-direction:column">${wk.map(hr).join('')}</div>`), '20'));

  const planning = [
    ['P0', 'Figma 27개 프레임 임포트·연결 유지', '화면이 바뀔 때마다 해당 프레임만 다시 임포트하고 플러그인으로 연결을 복구합니다. 이 보드의 정본은 HTML이고 Figma는 리뷰용 스냅샷입니다.'],
    ['P0', '9/17 발표 자료 구성', '검색 → 담기 → 신청 문서 작성으로 이어지는 시연 흐름을 슬라이드로 정리합니다. 발표 경로 표시가 붙은 화면이 시연 대상입니다.'],
    ['P1', '화면 캡처 채우기', '화면별 구현·시안 캡처와 히스토리 줄별 캡처를 채웁니다. 미구현 화면은 시안 캡처만 있어도 됩니다.'],
    ['P1', '결정 회의 진행·기록', '결정 대기 질문을 회의에 올리고, 정해진 답과 이유를 해당 화면 히스토리에 한 줄로 남깁니다. 결정 자체는 팀 몫이고 기록이 기획 몫입니다.'],
    ['P2', '시안과 구현의 차이 재정리', 'UI Explorer 시안에 없는 신청 문서 작성·중복 검토를 시안에 추가할지, 발표에서 별도로 설명할지 정리합니다.'],
  ];
  const dq = S.filter((s) => s.questions && s.questions.length);
  await saveFile('figma-frames/19-owner-hong.html', page('19 홍지윤 담당', card(vh('홍지윤 님의 담당 작업', '기획 · 문서 정리', 'background:#f1f2f3;color:#606770', '화면을 만드는 담당이 아니라 <strong style="color:#202124">기록과 발표 자료</strong>를 맡습니다. 결정 대기 질문은 팀 회의에서 답을 내는 것이고, 그 결과를 보드와 Figma에 반영하는 것이 이 목록입니다.')
    + `<div style="display:flex;flex-direction:column;gap:10px">${planning.map((p) => `<div style="border:1px solid #e3e5e8;border-radius:16px;padding:16px 20px;display:flex;flex-direction:column;gap:7px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="${mono};font-size:11px;font-weight:900;border-radius:5px;padding:3px 9px;${prioStyle[p[0]]}">${p[0]}</span><span style="font-size:14px;font-weight:700">${esc(p[1])}</span></div><p style="margin:0;font-size:12.5px;line-height:1.8;color:#606770">${esc(p[2])}</p></div>`).join('')}</div>`
    + `<div style="border-top:1px solid #e3e5e8;padding-top:16px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span style="font-size:15px;font-weight:900;letter-spacing:-0.03em">회의에 올릴 결정 대기</span><span style="border-radius:999px;background:#fff4e0;color:#8a5a00;font-size:11.5px;font-weight:900;padding:5px 12px">${planN}건</span></div>${dq.map((s) => `<div style="border:1px solid #e3e5e8;border-radius:16px;padding:16px 20px;display:flex;flex-direction:column;gap:11px">${sh(s)}${s.questions.map((q) => `<div style="display:flex;gap:10px;align-items:flex-start;border-radius:12px;background:#fffaf0;padding:11px 14px"><span style="flex:none;${mono};font-size:11px;font-weight:700;color:#8a5a00;margin-top:2px">?</span><span style="font-size:12.5px;line-height:1.7">${esc(q)}</span></div>`).join('')}</div>`).join('')}</div>`), '19'));

  const st = [['21', 'done', 'live', '구현 완료된 부분', '동작이 확인된 항목입니다. 여기에 있는 것은 다시 만들지 않아도 됩니다.'], ['22', 'partial', 'part', '부분 구현 · 데모 상태', '화면은 있으나 저장·연결·검증·배포가 남은 항목입니다. 가장 먼저 마무리할 대상입니다.'], ['23', 'todo', 'gap', '아직 손대지 않은 부분', '코드가 없는 항목입니다. 착수 전에 범위와 담당을 정해야 합니다.']];
  for (const [no, f, tone, title, desc] of st) {
    const gs = S.map((s) => ({ s, items: s.elements.filter((e) => e.tone === tone) })).filter((x) => x.items.length)
      .sort((a, b) => prioRank[a.s.prio || 'P2'] - prioRank[b.s.prio || 'P2']);
    await saveFile('figma-frames/' + no + '-' + f + '.html', page(no + ' ' + title, card(vh(title, cnt(tone) + '개 항목 · ' + gs.length + '개 화면', chips[tone], desc) + `<div style="display:flex;flex-direction:column;gap:12px">${gs.map(({ s, items }) => `<div style="border:1px solid #e3e5e8;border-radius:16px;padding:16px 20px;display:flex;flex-direction:column;gap:11px">${sh(s)}${eg(items)}${tone !== 'live' ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;border-top:1px solid #f1f2f3;padding-top:12px"><div style="display:flex;flex-direction:column;gap:7px;min-width:0"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#087f46">다음 변경 예정</span>${bl(s.next, '#087f46', '□')}</div><div style="display:flex;flex-direction:column;gap:7px;min-width:0"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#8a5a00">결정이 필요한 질문</span>${bl(s.questions, '#8a5a00', '?')}</div></div>` : ''}</div>`).join('')}</div>`), no));
  }

  const OF = { 24: ['김건우', 'kim-gunwoo'], 25: ['김동섭', 'kim-dongseop'], 26: ['송승재', 'song-seungjae'], 27: ['이성민', 'lee-seongmin'] };
  for (const no of Object.keys(OF)) {
    const [nm, slug] = OF[no];
    const mine = S.filter((s) => s.owner === nm).sort((a, b) => prioRank[a.prio || 'P2'] - prioRank[b.prio || 'P2']);
    const p0 = mine.filter((s) => (s.prio || 'P2') === 'P0').length;
    await saveFile('figma-frames/' + no + '-owner-' + slug + '.html', page(no + ' ' + nm + ' 담당', card(vh(nm + ' 님의 담당 화면', '남은 항목 ' + ownerOpen(nm) + '개 · 발표 전 필수 ' + p0 + '개', 'background:#fff4e0;color:#8a5a00', '담당 화면 ' + mine.length + '개 · 우선순위 높은 순서입니다. <strong style="color:#202124">P0</strong>은 9/17 발표 전, <strong style="color:#202124">P1</strong>은 발표 직후, <strong style="color:#202124">P2</strong>는 범위를 정한 다음입니다.') + `<div style="display:flex;flex-direction:column;gap:12px">${mine.map((s) => { const td = s.elements.filter((e) => e.tone !== 'live'); return `<div style="border:1px solid #e3e5e8;border-radius:16px;padding:16px 20px;display:flex;flex-direction:column;gap:11px">${sh(s)}<p style="margin:0;font-size:12px;line-height:1.75;color:#606770;border-left:2px solid #e3e5e8;padding-left:11px">${esc(s.prioWhy || '')}</p>${td.length ? eg(td) : '<span style="font-size:12.5px;color:#087f46;font-weight:700">남은 항목 없음 · 구현 완료</span>'}<div style="display:flex;flex-direction:column;gap:7px;border-top:1px solid #f1f2f3;padding-top:12px"><span style="${mono};font-size:10px;letter-spacing:0.12em;color:#087f46">다음 변경 예정</span>${bl(s.next, '#087f46', '□')}</div></div>`; }).join('')}</div>`), no));
  }
  log('frames rebuilt: ' + (S.length + 11) + ' | history ' + allN + ' | el ' + cnt('live') + '/' + cnt('part') + '/' + cnt('gap'));
}
