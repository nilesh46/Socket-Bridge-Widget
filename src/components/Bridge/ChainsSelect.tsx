import React, { useContext } from "react";
import { useQuery } from "react-query";
import { getSupportedChains } from "../../services";
import { ChainIdContext, TokenDetailsContext } from "./WidgetWrapper";
import RightArrowSvg from "../../assets/right-arrow.svg";
import { Obj } from "../../types";
import InputChainSelect from "./InputChainSelect";
import OutputChainSelect from "./OutputChainSelect";

const getChainDataByChainId = (chains: any) => {
  if (!chains.isSuccess) return [];

  const data = chains.data?.data?.result;
  const chainsByChainId: any = {};
  const fromChainsList: Array<Obj> = [];
  const toChainsList: Array<Obj> = [];

	data.forEach((chain:any) => {
		chainsByChainId[chain.chainId] = chain;
    if (chain.sendingEnabled) {
      fromChainsList.push({
        chainId: chain.chainId,
        name: chain.name,
        icon: chain.icon
      });
    }
    if (chain.receivingEnabled) {
      toChainsList.push({
        chainId: chain.chainId,
        name: chain.name,
        icon: chain.icon
      });
    }
	});
  return [chainsByChainId, fromChainsList, toChainsList];
};

const ChainsSelect: React.FC = () => {
  const chainsResponse = useQuery(["chains"], getSupportedChains);

  const { inputChainId, outputChainId, setInputChainId, setOutputChainId } = useContext(ChainIdContext);
  const { setInputTokenDetails, setOutputTokenDetails } = useContext(TokenDetailsContext);

  const [chainsByChainId, fromChainsList, toChainsList] = getChainDataByChainId(chainsResponse);

  const swap = () => {
    if (
      chainsByChainId[inputChainId].receivingEnabled === true &&
      chainsByChainId[outputChainId].sendingEnabled === true
    ) {
      const fromChain = inputChainId, toChain = outputChainId;
      setInputChainId(toChain);
      setOutputChainId(fromChain);
    }
  };

  return (
    <div id="chain-select" className="grid grid-cols-11 gap-4 rounded-xl">
      <InputChainSelect
        chainsByChainId={chainsByChainId}
        fromChainsList={fromChainsList}
        swap={swap}
      />
      <div id="swap-chains" className="self-center text-fc">
        <div
          className="flex justify-center items-center rounded-lg border-2 border-bgLight bg-pr h-7 hover:cursor-pointer hover:bg-bgLight"
          onClick={() => {
            setInputTokenDetails({ address: "", icon: "", symbol: "", decimals: 0 })
            setOutputTokenDetails({ address: "", icon: "", symbol: "", decimals: 0 })
            swap();
          }}
        >
          <RightArrowSvg className="h-3 w-3" />
        </div>
      </div>
      <OutputChainSelect
        chainsByChainId={chainsByChainId}
        toChainsList={toChainsList}
        swap={swap}
      />
    </div>
  );
}

export default ChainsSelect;