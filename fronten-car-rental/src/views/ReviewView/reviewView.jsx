import { useState } from 'react';
import HerosectionCustomer from './heroSectionREview';
import AllREviews from './allReviews';

export default function ReviewView() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div>
            <HerosectionCustomer onSearch={setSearchTerm} />
            <AllREviews searchTerm={searchTerm} />
        </div>
    );
}
