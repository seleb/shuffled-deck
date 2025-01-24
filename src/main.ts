
const suits = ['spades','hearts','diamonds','clubs'];
const values = [1,2,3,4,5,6,7,8,9,10,11,13,14];

const suitOffsets = ['spades','hearts','diamonds','clubs'].reduce((result, suit, idx) => ({
	...result,
	[suit]: idx*16,
}), {});
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
function getSymbol({
	suit,
	value,
}) {
	const unique = {
		'back': 0x1F0A0,
		'joker': 0x1F0BF,
	};
	if (unique[value]) {
		return String.fromCodePoint(unique[value]);
	}
	const start = unique.back;
	return String.fromCodePoint(start + suitOffsets[suit] + parseInt(value,10));
}

function shuffle() {
	const ref = [];
	const jokers = parseInt(document.getElementById('jokers').value, 10);
	new Array(jokers).fill(0).forEach(() => ref.push({
		suit: '',
		value: 'joker',
	}));
	suits.forEach(suit => values.forEach(value => ref.push({
		suit,
		value,
	})));
	
	const deck = [];
	while(ref.length) {
		deck.push(ref.splice(Math.floor(Math.random()*ref.length), 1)[0]);
	}
	const el = document.getElementById('deck');
	el.innerHTML = '';
	deck.forEach(({
		suit,
		value,
	}) => {
		const li = document.createElement('li');
		function flipUp() {
			li.innerText = getSymbol({ suit, value });
			li.className = suit;
			li.title = `${names[value] || value}${suit && ` of ${suit}`}`;
			li.onclick = flipDown;
		}
		function flipDown() {
			li.innerText = getSymbol({ value: 'back' });
			li.className= 'back';
			li.title = '';
			li.onclick = flipUp;
		}
		flipDown();
		el.appendChild(li);
	});
}

const elBtnShuffle = document.querySelector('button');
if (!elBtnShuffle) throw new Error("could not find elements");
elBtnShuffle.addEventListener('click', shuffle);
shuffle();
