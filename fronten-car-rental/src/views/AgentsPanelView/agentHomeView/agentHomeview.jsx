import AgentDashboardView from "./agentDashboard";
import BookingListDashboard from "./bookingListDashboard";
import CarListingDashboard from "./carListingDashboard";
import CarStatusDasboard from "./carStatusDashboard";
import MsgDashboard from "./msgDashboard";


export default function AgentPanelHomeView(){
    return(
         <div>
                   <AgentDashboardView/>
                   <MsgDashboard/>
                   <BookingListDashboard/>
                   <CarListingDashboard/>
                   <CarStatusDasboard/>
         </div>
    )
}