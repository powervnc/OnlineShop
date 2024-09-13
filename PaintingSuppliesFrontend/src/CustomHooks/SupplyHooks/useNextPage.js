import { useSupplyContext } from "../../Contexts/ContextSupply";
import useGetPaginatedSupplies from "./useGetPaginatedSupply";

const useNextPage = () => {
  const {
    setSupplies,
    setCurrentPage,
    currentPage,
    totalPages,
    setPreviousButtonVisible,
    setNextButtonVisible,
    previousSelectedProducer
  } = useSupplyContext();

  const getPage = useGetPaginatedSupplies();
  const getNextPage = async () => {
    const supplies = await getPage(previousSelectedProducer,currentPage + 1,false);
    if(supplies.length>0){
    setPreviousButtonVisible(true);
    if (currentPage + 1 == totalPages) setNextButtonVisible(false);
    setCurrentPage(currentPage + 1);
    setSupplies(supplies);
    }
  };
  return getNextPage;
};
export default useNextPage;
