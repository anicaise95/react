import { useRef, useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Contract({ value, textGreeter }) {
  const spanEle = useRef(null);
  const spanEle1 = useRef(null);

  const [eventValue, setEventValue] = useState("");
  const [oldEvents, setOldEvents] = useState();

  const { state: { contract } } = useEth();

  useEffect(() => {
    (async function () {

      let oldEvents = await contract.getPastEvents('valueChanged', {
        fromBlock: 0,
        toBlock: 'latest'
      });

      let oldies = [];
      oldEvents.forEach(element => {
        oldies.push(element.returnValues.newValue);
      });
      setOldEvents(oldies);

      await contract.events.valueChanged({ fromBlock: "earliest" })
        .on('data', event => {
          let lastEvent = event.returnValues.newValue;
          setEventValue(lastEvent);
        })
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))
    })();

  }, [contract])


  return (
    <code>
      {`contract SimpleStorage {
      
      uint256 value = `}

      <span className="secondary-color" ref={spanEle}>
        <strong>{value}</strong>
      </span>

      {`;
      string greeter = `}

      <span className="secondary-color" ref={spanEle1}>
        <strong>{textGreeter}</strong>
      </span>

      {`;

  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
  }

  function greet() public view returns (string memory) {
    return greeter;
  }

  function setGreeter(string memory _greeter) public {
      greeter = _greeter;
  }
}

Event arrivants : `} {eventValue} {`
Anciens events : `} {oldEvents}
    </code>
  );
}

export default Contract;
