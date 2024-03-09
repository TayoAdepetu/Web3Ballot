import { getProvider } from "./constants/providers";
import { getProposalsContract } from "./constants/contracts";
import { isSupportedChain } from "./utils";

const handleVote = async (chainId, walletProvider, id) => {
  if (!isSupportedChain(chainId)) return console.error("Wrong network");
  const readWriteProvider = getProvider(walletProvider);
  const signer = await readWriteProvider.getSigner();

  const contract = getProposalsContract(signer);

  try {
    const transaction = await contract.vote(id);
    console.log("transaction: ", transaction);
    const receipt = await transaction.wait();

    console.log("receipt: ", receipt);

    if (receipt.status) {
      return console.log("vote successfull!");
    }

    console.log("vote failed!");
  } catch (error) {
    console.log(error);
    let errorText;
    if (error.reason === "Has no right to vote") {
      errorText = "You have not right to vote";
    } else if (error.reason === "Already voted.") {
      errorText = "You have already voted";
    } else {
      errorText = "An unknown error occured";
    }

    console.error("error: ", errorText);
  }
};

export default handleVote;
