let walletAddress = "" ;
let contract = null ;

let FileContent = ''; // Variable to store file content
let FileName = '';    // Variable to store file name
// upload the file and extract its content
function uploadAndExtract() {
  const fileInput = document.getElementById('fileInput');
  const contentDisplay = document.getElementById('contentDisplay');

  const file = fileInput.files[0];

  if (file) {
    FileName = file.name; // Store the file name in the variable

    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
      FileContent = content;
      displayContent(content);
    };

    reader.readAsText(file);
  } else {
    alert('Please select a file.');
  }
}


// the function to display the file content after uploading and exctracting its content
function displayContent(content) {
  const contentDisplay = document.getElementById('contentDisplay');
  contentDisplay.textContent = `File Name: ${FileName}\n\nFile content:\n\n${content}`;
}


async function requestAccount(walletAddress){
    //check the existence of metamask
    if(window.ethereum){
      console.log("MetaMask detected !");
    } else {
      alert("MestaMask isn't detected !! , please install mehtaMask Extention First");

    }

    try{
      const accounts= await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    
      walletAddress =accounts[0];
    } catch(err){
      console.error(err);
    }
  }

  async function connectWallet(){
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      try{
      //initaiting a provider(META MASK) to intearct with the smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress= "0xE5035E57ca22A32CCec08F9d5086703C0d27f7AB" ;
      const ABI=[
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_url",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_content",
              "type": "string"
            }
          ],
          "name": "updateFileHash",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_url",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_newContent",
              "type": "string"
            }
          ],
          "name": "checkDataIntegrity",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      //initiating a contract instance for our smart contract
       contract= new ethers.Contract(contractAddress,ABI,signer);
      return contract ;
     

    } catch(err){
      console.error(err);
    }
    }
    
  }

  // the function to update the file hash

  async function updateFileHash() {
    let fileContent=FileContent;
    let fileName1= FileName ;

    if(fileName1==""){//checks if we already choosed a file and extracted its content, so that we don't make transaction with empty arguments..  
      document.getElementById("result").innerText = "you should choose a file and extract its content to Update its hash !!";
    }else{
    try {
        const contract = await connectWallet();
        if (contract) {
          // calling the updateFileHash() function from the smart contract .
            const updateFH = await contract.updateFileHash(fileName1, fileContent);
            await updateFH.wait(); // Wait for the transaction to be mined
            alert("Hash updated successfully");
        }
    } catch (err) {
        console.error("the connection to contract error:", err);
        alert("you don't have access to update the file hash");
    }
  }
}


// the function to verify the data integrity
async function verifyIntegrity() {
  let newFileContent=FileContent;
  let fileName2= FileName ;
  
  if(fileName2==""){//checks if we already choosed a file and extracted its content, so that we don't make transaction with empty arguments..  
    document.getElementById("result").innerText = "you should choose a file and extract its content !!";
  }else{
    try {
        const contract = await connectWallet();
        if (contract) {
            // calling the checkDataIntegrity() function from the smart contract .
            const verifyIntegrity = await contract.checkDataIntegrity(fileName2, newFileContent);
            console.log("the content to verify integrity is:", newFileContent , "and the url is:", fileName2);
            console.log("here's the result: ", verifyIntegrity);
        
            document.getElementById("result").innerText = verifyIntegrity;
        }
    } catch (err) {
        console.error("the connection to contract error:", err);
    }
}
}





document.getElementById('deployButton').addEventListener('click', updateFileHash);
document.getElementById('verifyButton').addEventListener('click', verifyIntegrity);
document.getElementById('uploadAndExtract').addEventListener('click', uploadAndExtract);

