//SPDX-License-Identifier: MIT 

pragma solidity ^0.8.19 ;
contract VerifyDataIntegrity {

    address admin ;

    constructor() {
      admin = msg.sender ;  
    } 



    // the array to store and extract the file Hashes related to their URLs
     mapping (string => bytes32) internal  FileHash ;

    //the Hashing Function
    function hash(string memory content)  internal pure returns(bytes32){
        bytes32 contentHash  = keccak256(bytes(content)) ;
         return  contentHash ;
           
    } 

    // the function to hash the file contents 
    function updateFileHash(string memory _url, string memory _content) public {
        // only the admin could create or update a file hash
        require(msg.sender == admin, "you don't have access to update the files hashes" );
        FileHash[_url] = hash(_content);
    }

    // the function to check a file content integrity
    function checkDataIntegrity(string memory _url, string memory _newContent) public view  returns(string memory) {
        string memory message ;

        if (FileHash[_url] == bytes32(0)) {
             message= "This URL is invalid, check the uploaded file and try again" ;
            return( message) ;
        }
        bytes32 currentHash= FileHash[_url];
        bytes32 newHash= hash(_newContent);
        
        if( currentHash == newHash){
            message= "content isn't modified!" ;
            return( message) ;
        } else {
            message= "Content has been modified !!  ";
            return (message);
            }
    }



    
}

