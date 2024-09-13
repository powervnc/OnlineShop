import { useSupplyContext } from "../../Contexts/ContextSupply";
import useGetNrSuppliesProducedBy from "./useGetNrProducers";
import useGetPaginatedSupplies from "./useGetPaginatedSupply";

const useSelectNewProducer = () => {
  const {
    setPreviousProducer,
    setTotalPages,
    dealWithNextButtonAtInitialization,
    setSupplies,
    setTotalCountSupplies,
    setPreviousButtonVisible,
    setCurrentPage,setCategory
  } = useSupplyContext();
  const getPaginatedSupplies = useGetPaginatedSupplies();
  const getNrSuppliesProducerBy = useGetNrSuppliesProducedBy();
  const selectNewProducer = async (selectedProducer,categorySupply) => {
    setPreviousButtonVisible(false);
    setPreviousProducer(selectedProducer);
    setCurrentPage(1);
    setCategory(categorySupply);
    let suppliesOnPage1;
    let nrSuppliesProduced;
    console.log("Catgeory when filering:", categorySupply);
    suppliesOnPage1 = await getPaginatedSupplies(selectedProducer, 1,false,categorySupply);
    nrSuppliesProduced = await getNrSuppliesProducerBy(selectedProducer,categorySupply);
    setTotalCountSupplies(nrSuppliesProduced);
    let nrPages = 0;
    if (nrSuppliesProduced == 0) nrPages = 1;
    else nrPages = Math.ceil(nrSuppliesProduced / 50);
    setTotalPages(nrPages);
    setSupplies(suppliesOnPage1);
    dealWithNextButtonAtInitialization(nrPages);
  };
  return selectNewProducer;
};
export default useSelectNewProducer;
