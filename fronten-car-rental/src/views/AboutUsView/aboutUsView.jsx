import React from 'react';
import axios from 'axios';
import CarCollection from "./carCollection";
import HerosectionAboutUs from "./heroSectionAboutUs";
import ServicesBenefit from "./services";
import TrustProperties from "./trustProperties";
import WhyChoose from "./whyChoose";
import FaqsAboutus from "./FaqsAboutUS";

export default function AboutUsView() {
    return (
        <div>
            <HerosectionAboutUs />
            <TrustProperties />
            <CarCollection />
            <ServicesBenefit />

            <WhyChoose />
            <FaqsAboutus />
        </div>
    )
}