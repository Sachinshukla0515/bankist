'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Sachin Shukla',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Anju Bharti',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-24T18:49:59.371Z',
    '2021-06-25T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// formating currencies
const formatCur = function(value,locale,currency){
  return  new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
  }).format(value);
};

// formating dates
const formatMovementDate = function(date,locale){
   
    const calDaysPassed=(first,second)=>Math.round(Math.abs(first-second)/(1000*60*60*24));
    
    const daysPassed = calDaysPassed(new Date(),date);
    if(daysPassed===0) return 'Today';
    if(daysPassed===1) return 'Yesterday';
    if(daysPassed<=7) return `${daysPassed} days ago`;
    
    // const day = `${date.getDate()}`.padStart(2,0);
    // const month= `${date.getMonth()+1}`.padStart(2,0);
    // const year=date.getFullYear();
    // return  `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movement=acc.movements.slice();
  console.log(acc.movements);
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date=new Date(acc.movementsDates[i])
    const displayDate=formatMovementDate(date,acc.locale);
    
    const formatedMov= formatCur(mov,acc.locale,acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(acc.balance,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out),acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest,acc.locale,acc.currency);;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function(){
 const tick= function(){
    const min=`${Math.trunc(time/60)}`.padStart(2,0);
    const sec=String(time%60).padStart(2,0);
    //in each time print the remaining time to UI 
    labelTimer.textContent=`${min}:${sec}`;
    if(time==0){
      clearInterval(timer);
      labelWelcome.textContent='Log in to get started'
      containerApp.style.opacity=0;
    }
    time--;
  }
  //set time to 5 minutes
  let time=300;
  // call the timer every second
  tick();
  const timer=setInterval(tick, 1000);
  return timer;
 

  // when o seconds,stop timer and logout user

}

///////////////////////////////////////
// Event handlers
let currentAccount,timer;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // create current date internationalizing dates
    const options={
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'numeric',
      year:'numeric'
    }
    // //to get locale from brower
    // const locale=navigator.language;
    // console.log(locale);
    
    const now= new Date();
    labelDate.textContent= new Intl.DateTimeFormat(currentAccount.locale,options).format(now);

    // const now= new Date();
    // const day = `${now.getDate()}`.padStart(2,0);
    // const month= `${now.getMonth()}`.padStart(2,0);
    // const year=now.getFullYear();
    // const hour= `${now.getHours()}`.padStart(2,0);
    // const min=`${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if(timer) clearInterval(timer);
    timer=startLogoutTimer();
    // Update UI
    updateUI(currentAccount);

  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // add transferr date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
   
    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer=startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
   setTimeout(function(){
    // Add movement
    currentAccount.movements.push(amount);
    // add date
    currentAccount.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);
  },5000);
}
  inputLoanAmount.value = '';
  //
  clearInterval(timer);
  timer=startLogoutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*

// converting number to strings
//conversion
console.log(Number('23'));
console.log(+'23');

//parsing: must start with number , 10 returns the base
console.log(Number.parseInt('30px',10));
console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));

//is NAN function : returns true if number is Nan
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));

// to check if value is number use isFinite function
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));

// to check if integer
console.log(Number.isInteger(23));
console.log(Number.isInteger(20/3));

// to find square root
console.log(Math.sqrt(25));
console.log(25**(1/2));

// finding max
console.log(Math.max(2,4,6,7,8,9));
console.log(Math.min(2,4,6,7,8));

//rounding integers
console.log(Math.trunc(23.3));

//rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));

// max safe integer that js can represent
console.log(2**53-1);
console.log(Number.MAX_SAFE_INTEGER);

// BIG INtegers to represent large number
console.log(2345678903456789034567890345678n);

//operations
console.log(100000000000000000000000000000000000000000n*10000000000000000000n);

//dates, times 

//create date
//1st way
const now=new Date();
console.log(now);

// 2nd way using parsing
console.log(new Date('june 20 2021 18:05:04'));
console.log(new Date('october 5,2021'));
console.log(new Date(account1.movementsDates[0]));

//working with dates
const future= new Date(2037,10,19,15,23,5);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getUTCHours());



//operations on dates
const future= new Date(2024,9,5,5,15,15);
console.log(future);
//function to count number of days passed
const calDaysPassed=(first,second)=>Math.abs(first-second)/(1000*60*60*24);

console.log(calDaysPassed( new Date(2024,9,5), new Date(2024,9,15,)));

// internationalization dates

const options={
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'numeric',
  year:'numeric'
}
//to get locale from brower
const locale=navigator.language;
console.log(locale);

const now= new Date();
labelDate.textContent= new Intl.DateTimeFormat(locale,options).format(now);


// internationalazing numbers
const num=38888321.54;
const options={
  style:'currency',
  unit:'celsius',
  currency:'USD',
};

console.log('IN:   ',new Intl.NumberFormat('en-IN',options).format(num));
console.log('US:   ',new Intl.NumberFormat('en-US',options).format(num));
console.log('IN:   ',new Intl.NumberFormat(navigator.language,options).format(num));


// settimeout fucntion controllring timer 
const ingredients=['cheese','olive','tomato']
const pizzaTimer=setTimeout((ing1,ing2,ing3)=>
 console.log(`here is your Pizza with ${ing1} ,${ing2} and ${ing3}`),
 3000,...ingredients);

console.log('waiting...');

if(ingredients.includes('potato')) clearTimeout(pizzaTimer);

//setInterval
setInterval(function(){
  const now=new Date();
  console.log(now);
},1000);
*/








