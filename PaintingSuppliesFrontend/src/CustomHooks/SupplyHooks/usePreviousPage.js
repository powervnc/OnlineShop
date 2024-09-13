import { useSupplyContext } from "../../Contexts/ContextSupply";
import useGetPaginatedSupplies from "./useGetPaginatedSupply";


const usePreviousPage=()=>{

    const {
        setSupplies,
        setCurrentPage,
        currentPage,
        setPreviousButtonVisible,
        setNextButtonVisible,
        previousSelectedProducer
      } = useSupplyContext();

    const getPage = useGetPaginatedSupplies();
    const getPreviousPage= async () => {
        const supplies = await getPage(previousSelectedProducer,currentPage -1,false );
       ///if getPage gets error-> it returuns an empty array
        if(supplies.length>0){
        setNextButtonVisible(true);
        if (currentPage - 1 ==1) setPreviousButtonVisible(false);
        
        setCurrentPage(currentPage -1);
        setSupplies(supplies);
        }
      };
    return getPreviousPage;

}
export default usePreviousPage;


