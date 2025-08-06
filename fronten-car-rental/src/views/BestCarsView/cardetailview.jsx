
import CarDetailCard from "./carDetail";
import HeroSectionCarDetail from "./cardetailherosection";
import CarServicesInfo from "./cardetailinfo";
import FAQDetailCars from "./faqsCardetail";
export default function DetailCar(){
    return(

        <div>
           <HeroSectionCarDetail/>
<CarDetailCard/>
           <CarServicesInfo/>
           <FAQDetailCars/>
        </div>
    )
}