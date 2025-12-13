// Ungaa demo: meaning-based video recommendations (client-side simulation)
document.addEventListener('DOMContentLoaded', () => {
	const videos = [
		{ id: 1, title: 'Derivatives - Intuitive Explanation', desc: 'Understand derivatives and rates of change with visual examples.', tags: ['calculus','derivative','math','rates'] },
		{ id: 2, title: 'Photosynthesis for Beginners', desc: 'Learn how plants convert light into chemical energy.', tags: ['biology','photosynthesis','plants','energy'] },
		{ id: 3, title: 'World War II Overview', desc: 'A concise overview of the causes and major events of WW2.', tags: ['history','ww2','wars','20th century'] },
		{ id: 4, title: 'Integrals: Area Under the Curve', desc: 'Visual explanation of integrals and accumulation.', tags: ['calculus','integral','math','area'] },
		{ id: 5, title: 'The Krebs Cycle', desc: 'Biochemistry: step-by-step breakdown of the Krebs cycle.', tags: ['biology','biochemistry','krebs','cellular respiration'] },
		{ id: 6, title: 'Essay Writing: Structure & Tips', desc: 'Best practices for organizing study essays and exams.', tags: ['writing','study skills','essays'] },
		{ id: 7, title: 'Quantum Mechanics - Core Ideas', desc: 'Simplified concepts of quantum physics for beginners.', tags: ['physics','quantum','science'] }
	];

	const synonyms = {
		// simple mapping to broaden meaning match
		derivatives: ['derivative','calculus','rates','change'],
		calculus: ['integral','derivative','limits','math'],
		photosynthesis: ['plants','chlorophyll','biology','energy'],
		history: ['ww2','wars','past','timeline']
	};

	const queryInput = document.getElementById('query');
	const searchBtn = document.getElementById('searchBtn');
	const videoGrid = document.getElementById('videoGrid');
	const suggestions = document.getElementById('suggestions');
	const phoneScreen = document.getElementById('phone-screen');

	function tokenize(str){
		return str.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
	}

	function scoreVideoForQuery(video, query){
		const qTokens = tokenize(query);
		let score = 0;
		qTokens.forEach(q => {
			// synonyms expansion
			const syns = synonyms[q] || [];
			const terms = [q, ...syns];
			terms.forEach(t => {
				if(video.tags.some(tag => tag.includes(t))) score += 2;
				if(video.title.toLowerCase().includes(t)) score += 3;
				if(video.desc.toLowerCase().includes(t)) score += 1;
			});
		});
		return score;
	}

	function recommend(query){
		if(!query || query.trim()===''){
			// default top picks
			return videos.slice(0,4);
		}
		const scored = videos.map(v => ({v,score:scoreVideoForQuery(v,query)}));
		scored.sort((a,b)=>b.score-a.score || a.v.title.localeCompare(b.v.title));
		return scored.filter(s=>s.score>0).map(s=>s.v);
	}

	function renderVideos(list){
		videoGrid.innerHTML = '';
		if(list.length === 0){
			videoGrid.innerHTML = '<div class="muted">No results — try simpler phrases (e.g., "calculus", "biology").</div>';
			return;
		}
		list.forEach(v => {
			const card = document.createElement('div');
			card.className = 'card';
			card.innerHTML = `
				<div class="thumb" data-id="${v.id}">▶</div>
				<h5>${v.title}</h5>
				<p>${v.desc}</p>
			`;
			videoGrid.appendChild(card);
			card.querySelector('.thumb').addEventListener('click', () => playPreview(v));
		});
	}

	function playPreview(video){
		phoneScreen.innerHTML = '';
		const title = document.createElement('div');
		title.style.padding = '14px';
		title.innerHTML = `<strong>${video.title}</strong><div style="color:var(--muted);font-size:12px;margin-top:6px">${video.desc}</div>`;
		phoneScreen.appendChild(title);
		// small toast in the phone-screen
		const play = document.createElement('div');
		play.style.padding = '10px';
		play.style.marginTop = '10px';
		play.style.color = 'var(--muted)';
		play.textContent = '▶ Playing preview (simulated)';
		phoneScreen.appendChild(play);
	}

	// suggestions
	const sampleQueries = ['derivatives','calculus','photosynthesis','world war 2','essay writing','quantum mechanics'];
	function showSuggestions(){
		suggestions.innerHTML = sampleQueries.map(s=>`<button class="btn ghost suggestion">${s}</button>`).join(' ');
		suggestions.querySelectorAll('.suggestion').forEach(btn => {
			btn.addEventListener('click', () => {
				queryInput.value = btn.textContent;
				triggerSearch();
			});
		});
	}

	function triggerSearch(){
		const q = queryInput.value.trim();
		const recs = recommend(q);
		renderVideos(recs);
		// also show top result preview
		if(recs.length>0) playPreview(recs[0]);
	}

	// initial load
	renderVideos(recommend(''));
	showSuggestions();

	searchBtn.addEventListener('click', triggerSearch);
	queryInput.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); triggerSearch(); } });

	// simple signup feedback
	const signupForm = document.getElementById('signupForm');
	signupForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		if(!email) return;
		signupForm.innerHTML = `<div style="color:var(--muted)">Thanks! We'll reach out to ${email}.</div>`;
	});
});
