import AllCarList from "./allCarsList";
import CarListCards from "./carListCards";
import MyCarListHeading from "./myCarListHeading";




export default function MyCarListView(){
    return(
         <div>
                  <MyCarListHeading/>

                  <AllCarList/>
                  
         </div>
    )
}