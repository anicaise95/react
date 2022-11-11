import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setValue, setTextGreeter }) {

  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [inputGreeter, setInputGreeter] = useState("");

  // Récupération des value sur l'evenement onClick
  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const handleInputGreeterChange = e => {
    console.log(e.target.value);
    setInputGreeter(e.target.value);
  };

  // Interrogation de la blockchain
  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value);
  };

  const greet = async () => {
    const greeter = await contract.methods.greet().call({ from: accounts[0] });
    setTextGreeter(greeter);
  };

  // Ecriture sur la blockchain
  const write = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(inputValue);
    await contract.methods.write(newValue).send({ from: accounts[0] });
    read();
  };

  const setGreet = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputGreeter === "") {
      alert("Please enter a message to write.");
      return;
    }
    const newGreeter = inputGreeter;
    await contract.methods.setGreet(newGreeter).send({ from: accounts[0] });
    greet();
  };

  return (
    <div className="btns">

      <button onClick={read}>
        read()
      </button>

      <div onClick={write} className="input-btn">
        write(<input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />)
      </div>

      <button onClick={greet}>
        greet()
      </button>

      <div onClick={setGreet} className="input-btn">
        setGreeter(<input
          type="text"
          placeholder="string"
          value={inputGreeter}
          onChange={handleInputGreeterChange}
        />)
      </div>

    </div>
  );
}

export default ContractBtns;
