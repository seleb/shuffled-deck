import pkg from '../package.json';

const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14];

const suitOffsets = ['spades', 'hearts', 'diamonds', 'clubs'].reduce(
	(result, suit, idx) => ({
		...result,
		[suit]: idx * 16,
	}),
	{}
);
const names = {
	1: 'ace',
	2: 'two',
	3: 'three',
	4: 'four',
	5: 'five',
	6: 'six',
	7: 'seven',
	8: 'eight',
	9: 'nine',
	10: 'ten',
	11: 'jack',
	12: 'knight',
	13: 'queen',
	14: 'king',
};

// symbol is
// 'suit-value'
// 'back'
// 'joker'
function getSymbol({ suit, value }) {
	const unique = {
		back: 0x1f0a0,
		joker: 0x1f0bf,
	};
	if (unique[value]) {
		return String.fromCodePoint(unique[value]);
	}
	const start = unique.back;
	return String.fromCodePoint(start + suitOffsets[suit] + parseInt(value, 10));
}

function getReferenceDeck() {
	const ref = [];
	const jokers = parseInt(document.getElementById('jokers').value, 10);
	new Array(jokers).fill(0).forEach(() =>
		ref.push({
			suit: '',
			value: 'joker',
		})
	);
	suits.forEach(suit =>
		values.forEach(value =>
			ref.push({
				suit,
				value,
			})
		)
	);
	return ref;
}

function createCard({ suit, value }) {
	const li = document.createElement('li');
	function flipUp() {
		li.innerHTML = `<span>${getSymbol({ suit, value })}</span>`;
		li.className = suit;
		li.title = `${names[value] || value}${suit && ` of ${suit}`}`;
		li.onclick = flipDown;
	}
	function flipDown() {
		li.innerHTML = `<span>${getSymbol({ value: 'back' })}</span>`;
		li.className = 'back';
		li.title = '';
		li.onclick = flipUp;
	}
	flipDown();
	return li;
}

function shuffle(arr) {
	const ref = arr.slice();
	const result = [];
	while (ref.length) {
		result.push(ref.splice(Math.floor(Math.random() * ref.length), 1)[0]);
	}
	return result;
}

function shuffleAll() {
	const ref = getReferenceDeck();

	const deck = shuffle(ref);
	const el = document.getElementById('deck');
	el.innerHTML = '';

	deck.forEach(card => {
		el.appendChild(createCard(card));
	});
}

function shuffleUnrevealed() {
	const ref = getReferenceDeck();

	const elsFlipped = document.querySelectorAll('#deck > :not(.back)');
	// remove flipped cards from reference deck
	elsFlipped.forEach(elCard => {
		const idx = ref.findIndex(({ suit, value }) => getSymbol({ suit, value }) === elCard.textContent);
		if (idx >= 0) ref.splice(idx, 1);
	});

	const deck = shuffle(ref);
	const el = document.getElementById('deck');
	el.innerHTML = '';

	// re-insert flipped cards
	elsFlipped.forEach(i => el.appendChild(i));

	deck.forEach(card => {
		el.appendChild(createCard(card));
	});
}

const elPreloader = document.querySelector('#preloader');
const elBtnShuffleAll = document.querySelector('#shuffle-all');
const elBtnShuffleUnrevealed = document.querySelector('#shuffle-unrevealed');
const elVersion = document.querySelector('#version');
if (!elPreloader || !elBtnShuffleAll || !elBtnShuffleUnrevealed || !elVersion) throw new Error('could not find elements');
elBtnShuffleAll.addEventListener('click', shuffleAll);
elBtnShuffleUnrevealed.addEventListener('click', shuffleUnrevealed);
shuffleAll();
elVersion.textContent = pkg.version;

elPreloader.remove();
