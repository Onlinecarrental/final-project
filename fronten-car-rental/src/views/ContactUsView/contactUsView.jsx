import ContactInformation from "./contactInformation"

import HeroSectionContactUs from "./heroSectionContactUs"
import LocationSection from "./location"

export default function ContactUsView(){
    return(

        <div>
          <HeroSectionContactUs/>
          <ContactInformation/>
          <LocationSection/>
        </div>
    )
}