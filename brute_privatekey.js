

const Web3 = require('web3');
const infura_key = '64620d71df4f41f98b3a4a2ae383d52e'
const web3 = new Web3('https://mainnet.infura.io/v3/'+infura_key);
const fs = require('fs');


const Bytes = require("./bytes");
const { keccak256, keccak256s } = require("./hash");
const elliptic = require("elliptic");
const secp256k1 = new elliptic.ec("secp256k1"); // eslint-disable-line
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;;
var entropy = Bytes.random(32);



const toChecksum = address => {
  const addressHash = keccak256s(address.slice(2));
  let checksumAddress = "0x";
  for (let i = 0; i < 40; i++) checksumAddress += parseInt(addressHash[i + 2], 16) > 7 ? address[i + 2].toUpperCase() : address[i + 2];
  return checksumAddress;
};
const fromPrivate = privateKey => {
  const buffer = new Buffer(privateKey.slice(2), "hex");
  const ecKey = secp256k1.keyFromPrivate(buffer);
  const publicKey = "0x" + ecKey.getPublic(false, 'hex').slice(2);
  const publicHash = keccak256(publicKey);
  const address = toChecksum("0x" + publicHash.slice(-40));
  return {
    address: address,
    privateKey: privateKey
  };
};
const getAddress_fromPrivate = privateKey => {
  const buffer = new Buffer(privateKey.slice(2), "hex");
  const ecKey = secp256k1.keyFromPrivate(buffer);
  const publicKey = "0x" + ecKey.getPublic(false, 'hex').slice(2);
  const publicHash = keccak256(publicKey);
  const address = toChecksum("0x" + publicHash.slice(-40));
  return address;
};

const create = entropy => {
  const innerHex = keccak256(Bytes.concat(Bytes.random(32), entropy || Bytes.random(32)));
  //console.log(innerHex);
  const middleHex = Bytes.concat(Bytes.concat(Bytes.random(32), innerHex), Bytes.random(32));
  const outerHex = keccak256(middleHex);
  //console.log(outerHex);
  return fromPrivate(outerHex);
};
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
async function hack (){
	let balance=0;
	let wallet;
	let cnt_address;
	let private_key;
	while (true){
		private_key = Bytes.random(32);
		cnt_address = getAddress_fromPrivate(private_key);
		balance = await web3.eth.getBalance(cnt_address);
		if(balance > 0) {
		    fs.appendFileSync('wallets.txt', private_key+'\n');
		    console.log('\n');
		    console.log('address --->>' + ' '+ cnt_address);
		    console.log('private key --->>' + ' '+ private_key);
		}
	}
}
hack();

