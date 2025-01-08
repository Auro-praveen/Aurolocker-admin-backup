import {React} from "react";
import './AvailableLockers.css'
import Map from '../assets/images/map.png'

function AvailableLockers() {

    let cityNames =  ['Bengaluru', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'Hyderabad', 'Kochi'];
    
    const url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1456.3883596830797!2d77.59612720757738!3d12.96606024852983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae168154ea44fb%3A0x3db28e9d2a6cf76f!2sIndo%20Nissin%20Foods%20Private%20Limited!5e0!3m2!1sen!2sin!4v1662353488538!5m2!1sen!2sin';

    return ( 
        <>
            <div className="locker-container">
                <div className="cityName-container">
                    <label htmlFor="city">Choose your city : </label>
                    <select name="city" id="cityName" className="dropdown-container">
                        { cityNames.map(cityName => {
                            return (
                                <option key={cityName} value={cityName} className="options-container"> { cityName }</option>
                            )
                            })
                        }
                    </select>
                </div>
                <div className="map-container">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1456.3883596830797!2d77.59612720757738!3d12.96606024852983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae168154ea44fb%3A0x3db28e9d2a6cf76f!2sIndo%20Nissin%20Foods%20Private%20Limited!5e0!3m2!1sen!2sin!4v1662353488538!5m2!1sen!2sin" width="100%" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    {/* <img src={ Map } alt="map" /> */}
                </div>
            </div>
        </>
     );
}

export default AvailableLockers;
