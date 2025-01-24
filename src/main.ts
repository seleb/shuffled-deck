import pkg from '../package.json';

const elPreloader = document.querySelector('#preloader');
const elBtnShuffleAll = document.querySelector('#shuffle-all');
const elBtnShuffleUnrevealed = document.querySelector('#shuffle-unrevealed');
const elVersion = document.querySelector('#version');
const elJokers = document.querySelector<HTMLInputElement>('#jokers');
const elDeck = document.querySelector('#deck');
if (!elPreloader || !elBtnShuffleAll || !elBtnShuffleUnrevealed || !elJokers || !elDeck || !elVersion) throw new Error('could not find elements');

const suits = ['spades', 'hearts', 'diamonds', 'clubs'] as const;
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14] as const;

type Suit = (typeof suits)[number] | '';
type Value = `${(typeof values)[number]}` | 'back' | 'joker';
type Card = { suit: Suit; value: Value };

const suitOffsets = suits.reduce<Record<Suit, number>>(
	(result, suit, idx) => ({
		...result,
		[suit]: idx * 16,
	}),
	{
		'': 0,
		spades: 0,
		hearts: 0,
		diamonds: 0,
		clubs: 0,
	}
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
	back: 'back',
	joker: 'joker',
};

// symbol is
// 'suit-value'
// 'back'
// 'joker'
function getSymbol({ suit, value }: Card) {
	const unique = {
		back: 0x1f0a0,
		joker: 0x1f0bf,
	};
	if (value === 'back' || value === 'joker') {
		return String.fromCodePoint(unique[value]);
	}
	const start = unique.back;
	return String.fromCodePoint(start + suitOffsets[suit] + parseInt(value, 10));
}

const getReferenceDeck = () => {
	const ref: Card[] = [];
	const jokers = parseInt(elJokers.value, 10);
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
				value: value.toString(10) as `${typeof value}`,
			})
		)
	);
	return ref;
};

function createCard({ suit, value }: Card) {
	const li = document.createElement('li');
	function flipUp() {
		li.innerHTML = `<span>${getSymbol({ suit, value })}</span>`;
		li.className = suit;
		li.title = `${names[value] || value}${suit && ` of ${suit}`}`;
		li.onclick = flipDown;
	}
	function flipDown() {
		li.innerHTML = `<span>${getSymbol({ suit: '', value: 'back' })}</span>`;
		li.className = 'back';
		li.title = '';
		li.onclick = flipUp;
	}
	flipDown();
	return li;
}

function shuffle<T>(arr: readonly T[]) {
	const ref = arr.slice();
	const result = [];
	while (ref.length) {
		result.push(ref.splice(Math.floor(Math.random() * ref.length), 1)[0]);
	}
	return result;
}

const shuffleAll = () => {
	const ref = getReferenceDeck();

	const deck = shuffle(ref);
	elDeck.innerHTML = '';

	deck.forEach(card => elDeck.appendChild(createCard(card)));
};

const shuffleUnrevealed = () => {
	const ref = getReferenceDeck();

	const elsFlipped = document.querySelectorAll('#deck > :not(.back)');
	// remove flipped cards from reference deck
	elsFlipped.forEach(elCard => {
		const idx = ref.findIndex(({ suit, value }) => getSymbol({ suit, value }) === elCard.textContent);
		if (idx >= 0) ref.splice(idx, 1);
	});

	const deck = shuffle(ref);
	elDeck.innerHTML = '';

	// re-insert flipped cards
	elsFlipped.forEach(i => elDeck.appendChild(i));

	deck.forEach(card => elDeck.appendChild(createCard(card)));
};
elBtnShuffleAll.addEventListener('click', shuffleAll);
elBtnShuffleUnrevealed.addEventListener('click', shuffleUnrevealed);
shuffleAll();
elVersion.textContent = pkg.version;

elPreloader.remove();
