(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(n){if(n.ep)return;n.ep=!0;const l=s(n);fetch(n.href,l)}})();const v="jeapordy-board-v1",D="jeapordy-teams-v1",q=[100,200,300,400,500],S=[{name:"Team 1",score:0},{name:"Team 2",score:0},{name:"Team 3",score:0}],T={categories:[{title:"Favorites",clues:[{value:100,question:"This color is Josie's favorite.",answer:"What is green?",answered:!1,isDailyDouble:!1},{value:200,question:"This food is one Josie could always eat.",answer:"What is cheese?",answered:!1,isDailyDouble:!1},{value:300,question:"This genre of music is the bride's go-to for listening.",answer:"What is rock?",answered:!1,isDailyDouble:!1},{value:400,question:"This restaurant is one of Josie's favorites.",answer:"What is Zola?",answered:!1,isDailyDouble:!1},{value:500,question:"This vacation spot is one of Josie's favorites to visit.",answer:"Where is the Oregon Coast?",answered:!1,isDailyDouble:!1}]},{title:"Hill's History",clues:[{value:100,question:"These two are Josie's parents.",answer:"Who is Stefani and Dennis?",answered:!1,isDailyDouble:!1},{value:200,question:"This extracurricular activity was what she participated in during High School.",answer:"What is Band?",answered:!1,isDailyDouble:!1},{value:300,question:"Not everyone has the same sized feet. This number represents Josie's shoe size.",answer:"What is 11?",answered:!1,isDailyDouble:!1},{value:400,question:"If you wanted to get her attention on the playground, you might have called her by this childhood nickname.",answer:"What is Picke? (Or JoJo)",answered:!1,isDailyDouble:!1},{value:500,question:"This celebrity could be found in the posters of the bride's bedroom.",answer:"Who is Ian Somerhalder?",answered:!1,isDailyDouble:!1}]},{title:"It's a Love Story",clues:[{value:100,question:"This is the specific location is where the bride and groom first crossed paths.",answer:"Where is Walmart?",answered:!1,isDailyDouble:!1},{value:200,question:"The movies are a classic first date activity. This was the name of the movie that the couple saw together.",answer:"What is Spider-Man?",answered:!1,isDailyDouble:!1},{value:300,question:"____ was a fine year. It was also the year this couple started dating.",answer:"What is 2019?",answered:!1,isDailyDouble:!1},{value:400,question:"Between the wedding planning, the couple still finds time for dates. This location was where they last went.",answer:"Where is The Max?",answered:!1,isDailyDouble:!1},{value:500,question:"This long-running television show is a favorite of the couple.",answer:"What is Supernatural?",answered:!1,isDailyDouble:!1}]},{title:"Where in the World",clues:[{value:100,question:"Where was this photo taken?",answer:"Where is ___?",answered:!1,isDailyDouble:!1,picture:"/pictures/josie_unknown.jpg"},{value:200,question:"Where was this photo taken?",answer:"Where is Alaska?",answered:!1,isDailyDouble:!1,picture:"/pictures/josie_alaska.jpg"},{value:300,question:"Where was this photo taken?",answer:"Where is Banff?",answered:!1,isDailyDouble:!1,picture:"/pictures/josie_banff.png"},{value:400,question:"Where was this photo taken?",answer:"Where is ___?",answered:!1,isDailyDouble:!1},{value:500,question:"Where was this photo taken?",answer:"Where is ___?",answered:!1,isDailyDouble:!1}]},{title:"The Kids",clues:[{value:100,question:"These are the names of the couple's two cats.",answer:"Who are Goose and Fumi?",answered:!1,isDailyDouble:!1},{value:200,question:"Of their feline children, this one can be found gagging all the time.",answer:"Who is Goose?",answered:!1,isDailyDouble:!1},{value:300,question:"This is the show that Fumi's namesake is from.",answer:'What is "The Rising of Shield Hero"?',answered:!1,isDailyDouble:!1},{value:400,question:"This kitty loves the Bride the most.",answer:"Who is Fumi?",answered:!1,isDailyDouble:!1},{value:500,question:"This kitty love the Groom the most.",answer:"Who is Goose?",answered:!1,isDailyDouble:!1}]}]},y=document.querySelector("#app"),t={board:R(),teams:z(),selected:null,showAnswer:!1,showDailyDoubleAnnouncement:!1,adminOpen:!1,adminCategoryIndex:0,adminClueIndex:0,introComplete:localStorage.getItem("jeapordy-intro-complete")==="true",boardFillActive:!1,selectedTeams:[]};W();function W(){E(t.board)||(h(t.board),u()),c()}function c(){if(t.boardFillActive)return;if(!t.introComplete){x();return}const a=t.board;y.innerHTML=`
    <div class="app-shell">
      <div class="layout ${t.adminOpen?"admin-open":""}">
        <section class="board-stage">
          <div class="board-frame">
            <div class="grid">
              ${a.categories.map(e=>`<div class="category-cell">${d(e.title)}</div>`).join("")}

              ${N(a)}
            </div>
          </div>
        </section>

        ${t.adminOpen?B():""}
      </div>

      ${L()}

      <div class="controls controls-bottom">
        <button class="btn-primary" data-action="reset-progress">Clear Board</button>
        <button class="btn-secondary" data-action="toggle-admin">${t.adminOpen?"Close Admin":"Open Admin"}</button>
        <button class="btn-secondary" data-action="restart-intro">Restart Intro</button>
      </div>
    </div>

    ${J()}
    ${j()}
  `,I()}function C(){const a=t.board;let e="";for(let s=0;s<5;s+=1)for(let o=0;o<5;o+=1){const n=a.categories[o].clues[s];e+=`<div class="clue-btn fill-value-cell">$${n.value}</div>`}y.innerHTML=`
    <div class="board-fill-scene">
      <div class="board-fill-wrapper" id="boardFillWrapper">
        <div class="board-frame">
          <div class="grid">
            ${a.categories.map((s,o)=>`
                  <div class="category-cell board-fill-cat" data-col="${o}">
                    <span class="cat-fill-text">${d(s.title)}</span>
                  </div>`).join("")}
            ${e}
          </div>
        </div>
      </div>
    </div>
  `}function _(){g("/sounds/boardfill.mp3");for(let l=0;l<5;l+=1){const i=350+l*1300,m=i+420;setTimeout(()=>{const r=document.getElementById("boardFillWrapper");if(!r)return;const O=((l+.5)/5*100).toFixed(1);r.style.transformOrigin=`${O}% 12%`,r.style.transform="scale(3.2)"},i),setTimeout(()=>{const r=document.querySelector(`.board-fill-cat[data-col="${l}"] .cat-fill-text`);r&&r.classList.add("cat-revealed")},m)}setTimeout(()=>{const l=document.getElementById("boardFillWrapper");l&&(l.style.transformOrigin="50% 50%",l.style.transform="scale(1)",document.querySelectorAll(".fill-value-cell").forEach(i=>{i.classList.add("values-visible")}))},7350),setTimeout(()=>{t.boardFillActive=!1,t.introComplete=!0,localStorage.setItem("jeapordy-intro-complete","true"),c()},8300)}function x(){y.innerHTML=`
    <div class="app-shell">
      <div class="intro-container">
        <div class="intro-content">
          <h1 class="intro-title" data-text="Josie Jeapordy">Josie Jeapordy</h1>
          <div class="intro-subtitle">Let's Play!</div>
          <button class="btn-primary intro-start-btn" data-action="start-game" style="margin-top: 40px; font-size: 1.2rem; padding: 14px 28px;">Start Game</button>
        </div>
      </div>
    </div>
  `,I()}function N(a){let e="";for(let s=0;s<5;s+=1)for(let o=0;o<5;o+=1){const n=a.categories[o].clues[s];e+=`
        <button
          class="clue-btn ${n.answered?"answered":""}"
          data-action="open-clue"
          data-col="${o}"
          data-row="${s}"
          ${n.answered?"disabled":""}
        >
          $${n.value}
          ${t.adminOpen&&n.isDailyDouble?'<span class="daily-chip">Daily Double</span>':""}
        </button>
      `}return e}function L(){return`
    <div class="scoreboard">
      ${t.teams.map((a,e)=>`
            <div class="score-card">
              <div class="team-name">${d(a.name)}</div>
              <div class="team-score">$${a.score}</div>
            </div>
          `).join("")}
    </div>
  `}function B(){const a=t.board.categories[t.adminCategoryIndex],e=a.clues[t.adminClueIndex],s=t.board.categories.map((n,l)=>`<option value="${l}" ${l===t.adminCategoryIndex?"selected":""}>${l+1}. ${d(n.title)}</option>`).join(""),o=a.clues.map((n,l)=>`<option value="${l}" ${l===t.adminClueIndex?"selected":""}>$${n.value}</option>`).join("");return`
    <aside class="admin-panel">
      <h2>Admin</h2>
      <div class="admin-row">
        <label for="categorySelect">Edit Category</label>
        <select id="categorySelect" data-action="admin-select-category">${s}</select>
      </div>

      <div class="admin-row">
        <label for="categoryTitle">Category Name</label>
        <input id="categoryTitle" data-action="admin-category-title" value="${d(a.title)}" />
      </div>

      <div class="admin-row">
        <label for="clueSelect">Edit Clue Slot</label>
        <select id="clueSelect" data-action="admin-select-clue">${o}</select>
      </div>

      <div class="admin-row">
        <label for="questionInput">Question</label>
        <textarea id="questionInput" data-action="admin-question">${d(e.question)}</textarea>
      </div>

      <div class="admin-row">
        <label for="answerInput">Answer</label>
        <input id="answerInput" data-action="admin-answer" value="${d(e.answer)}" />
      </div>

      <div class="admin-row">
        <label for="pictureInput">Picture Path (optional)</label>
        <input id="pictureInput" data-action="admin-picture" value="${d(e.picture||"")}" placeholder="e.g. /pictures/josie_alaska.jpg" />
      </div>

      <div class="admin-actions">
        <button class="btn-primary" data-action="admin-save">Save Changes</button>
        <button class="btn-secondary" data-action="shuffle-dailies">Re-roll Daily Doubles</button>
        <button class="btn-secondary" data-action="reset-progress">Reset Board Progress</button>
        <button class="btn-danger" data-action="reset-all">Restore Default Categories/Questions</button>
      </div>

      <h3>Teams</h3>
      ${t.teams.map((n,l)=>`
            <div class="admin-row">
              <label>Team ${l+1} Name</label>
              <input type="text" data-action="team-name" data-team="${l}" value="${d(n.name)}" />
              <div style="font-size: 0.9rem; color: var(--muted); margin-top: 4px;">Score: $${n.score}</div>
            </div>
          `).join("")}
      <div class="admin-actions">
        <button class="btn-secondary" data-action="reset-scores">Reset All Scores</button>
      </div>
    </aside>
  `}function J(){return t.showDailyDoubleAnnouncement?`
    <div class="daily-double-overlay">
      <div class="daily-double-announcement">Daily Double!</div>
    </div>
  `:""}function j(){if(!t.selected)return'<div class="modal-backdrop"></div>';const{category:a,clue:e}=t.selected,s=e.isDailyDouble&&!t.showAnswer,o=t.teams.map((l,i)=>{const m=i+1;return`<button
        class="btn-team${t.selectedTeams.includes(m)?" team-selected":""}"
        data-action="toggle-team"
        data-team="${m}"
      >${d(l.name)}</button>`}).join(""),n=t.selectedTeams.length>0;return`
    <div class="modal-backdrop open" data-action="backdrop-close">
      <div class="modal modal-game" role="dialog" aria-modal="true" aria-label="Question panel">
        <div class="modal-header">
          <div class="modal-category">${d(a.title)}</div>
        </div>
        ${s?'<div class="daily-banner">Daily Double!</div>':""}
        <div class="modal-content">
          ${e.picture?`<img class="clue-photo" src="${d(e.picture)}" alt="Where in the World clue" />`:""}
          <div class="clue-text">${d(e.question)}</div>
          ${t.showAnswer?`<div class="answer">${d(e.answer)}</div>`:""}
        </div>
        <div class="modal-controls">
          ${t.showAnswer?`
            <div class="team-toggle-row">${o}</div>
            <div class="award-confirm-row">
              <button class="btn-confirm-award" data-action="confirm-award"${n?"":" disabled"}>Award Points</button>
              <button class="btn-team btn-no-points" data-action="no-points">No Points</button>
            </div>
          `:'<button class="btn-primary" data-action="show-answer">Show Answer</button>'}
        </div>
      </div>
    </div>
  `}function I(){y.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",k)});const a=document.getElementById("categorySelect"),e=document.getElementById("clueSelect");a&&a.addEventListener("change",()=>{t.adminCategoryIndex=Number(a.value),t.adminClueIndex=0,c()}),e&&e.addEventListener("change",()=>{t.adminClueIndex=Number(e.value),c()}),y.querySelectorAll('[data-action="team-name"]').forEach(s=>{s.addEventListener("change",()=>{const o=Number(s.dataset.team);t.teams[o].name=s.value.trim()||`Team ${o+1}`,w(),c()})})}function k(a){const e=a.currentTarget.dataset.action;if(e==="start-game"){t.boardFillActive=!0,C(),_();return}if(e==="open-clue"){const s=Number(a.currentTarget.dataset.col),o=Number(a.currentTarget.dataset.row);F(s,o);return}if(e==="toggle-admin"){t.adminOpen=!t.adminOpen,c();return}if(e==="restart-intro"){t.introComplete=!1,localStorage.removeItem("jeapordy-intro-complete"),c();return}if(e==="reset-progress"){P();return}if(e==="show-answer"){H(),t.showAnswer=!0,c();return}if(e==="toggle-team"){const s=Number(a.currentTarget.dataset.team),o=t.selectedTeams.indexOf(s);o===-1?t.selectedTeams.push(s):t.selectedTeams.splice(o,1),c();return}if(e==="confirm-award"){if(t.selected&&t.selectedTeams.length>0){let s=t.selected.clue.value;t.selected.clue.isDailyDouble&&(s*=2),t.selectedTeams.forEach(o=>{t.teams[o-1].score+=s}),w(),A()}t.selected&&(t.selected.clue.answered=!0,u()),t.selected=null,t.showAnswer=!1,t.showDailyDoubleAnnouncement=!1,t.selectedTeams=[],c();return}if(e==="no-points"){$(),t.selected&&(t.selected.clue.answered=!0,u()),t.selected=null,t.showAnswer=!1,t.showDailyDoubleAnnouncement=!1,t.selectedTeams=[],c();return}if(e==="award-team"){const s=Number(a.currentTarget.dataset.team);if(t.selected&&s>0){let o=t.selected.clue.value;t.selected.clue.isDailyDouble&&(o*=2),t.teams[s-1].score+=o,w(),A()}else $();t.selected&&(t.selected.clue.answered=!0,u()),t.selected=null,t.showAnswer=!1,t.showDailyDoubleAnnouncement=!1,c();return}if(e==="mark-answered"){t.selected&&(t.selected.clue.answered=!0,u()),t.selected=null,t.showAnswer=!1,t.selectedTeams=[],c();return}if(e==="close-preview"||e==="backdrop-close"){if(e==="backdrop-close"&&a.target!==a.currentTarget)return;t.selected=null,t.showAnswer=!1,t.selectedTeams=[],c();return}if(e==="shuffle-dailies"){h(t.board),u(),c();return}if(e==="reset-all"){t.board=b(T),h(t.board),u(),c();return}if(e==="admin-save"&&M(),e==="reset-scores"){t.teams.forEach(s=>{s.score=0}),w(),c();return}}function F(a,e){const s=t.board.categories[a],o=s.clues[e];o.answered||(t.selected={category:s,clue:o},t.showAnswer=!1,o.isDailyDouble?(t.showDailyDoubleAnnouncement=!0,t.selectedTeams=[],c(),Z(),setTimeout(()=>{t.showDailyDoubleAnnouncement=!1,c()},3e3)):(U(),c()))}function M(){const a=document.getElementById("categoryTitle"),e=document.getElementById("questionInput"),s=document.getElementById("answerInput"),o=t.board.categories[t.adminCategoryIndex],n=o.clues[t.adminClueIndex],l=document.getElementById("pictureInput");o.title=(a?.value||"").trim()||o.title,n.question=(e?.value||"").trim()||n.question,n.answer=(s?.value||"").trim()||n.answer;const i=(l?.value||"").trim();i?n.picture=i:delete n.picture,u(),c()}function P(){t.board.categories.forEach(a=>{a.clues.forEach(e=>{e.answered=!1})}),t.teams.forEach(a=>{a.score=0}),u(),w(),c()}function E(a){let e=0;return a.categories.forEach(s=>{s.clues.forEach(o=>{o.isDailyDouble&&(e+=1)})}),e===2}function h(a){const e=[];a.categories.forEach((o,n)=>{o.clues.forEach((l,i)=>e.push({col:n,row:i}))}),a.categories.forEach(o=>{o.clues.forEach(n=>{n.isDailyDouble=!1})}),G(e),e.slice(0,2).forEach(({col:o,row:n})=>{a.categories[o].clues[n].isDailyDouble=!0})}function R(){const a=localStorage.getItem(v);if(!a){const e=b(T);return h(e),localStorage.setItem(v,JSON.stringify(e)),e}try{const e=JSON.parse(a);if(!e?.categories||e.categories.length!==5)throw new Error("Invalid board shape");const s=b(T);return s.categories.forEach((o,n)=>{const l=e.categories[n];if(!l||!Array.isArray(l.clues)||l.clues.length!==5)throw new Error(`Invalid clues in column ${n}`);o.clues.forEach((i,m)=>{const r=l.clues[m]||{};i.value=q[m],i.answered=typeof r.answered=="boolean"?r.answered:!1,i.isDailyDouble=typeof r.isDailyDouble=="boolean"?r.isDailyDouble:!1,typeof r.question=="string"&&r.question&&(i.question=r.question),typeof r.answer=="string"&&r.answer&&(i.answer=r.answer),typeof r.picture=="string"&&r.picture?i.picture=r.picture:(r.picture===null||r.picture==="")&&delete i.picture}),typeof l.title=="string"&&l.title&&(o.title=l.title)}),E(s)||h(s),localStorage.setItem(v,JSON.stringify(s)),s}catch{const e=b(T);return h(e),localStorage.setItem(v,JSON.stringify(e)),e}}function u(){localStorage.setItem(v,JSON.stringify(t.board))}function b(a){return structuredClone(a)}function G(a){for(let e=a.length-1;e>0;e-=1){const s=Math.floor(Math.random()*(e+1));[a[e],a[s]]=[a[s],a[e]]}}let p=null,f=null;function g(a){f&&(clearInterval(f),f=null),p&&(p.pause(),p.currentTime=0);const e=new Audio(a);p=e,e.play().catch(()=>{})}function H(a=600){if(!p||p.paused)return;f&&(clearInterval(f),f=null);const e=p,s=e.volume,o=20,n=a/o,l=s/o;f=setInterval(()=>{e.volume>l?e.volume=Math.max(0,e.volume-l):(e.volume=0,e.pause(),clearInterval(f),f=null)},n)}function U(){g("/sounds/theme.mp3")}function Z(){g("/sounds/dailydouble.mp3")}function A(){g("/sounds/correct.mp3")}function $(){g("/sounds/nopoints.mp3")}function d(a){return String(a).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function z(){const a=localStorage.getItem(D);if(!a){const e=b(S);return localStorage.setItem(D,JSON.stringify(e)),e}try{const e=JSON.parse(a);if(!Array.isArray(e)||e.length!==3)throw new Error("Invalid teams shape");return e.forEach(s=>{typeof s.name!="string"&&(s.name="Team"),typeof s.score!="number"&&(s.score=0)}),e}catch{const e=b(S);return localStorage.setItem(D,JSON.stringify(e)),e}}function w(){localStorage.setItem(D,JSON.stringify(t.teams))}
