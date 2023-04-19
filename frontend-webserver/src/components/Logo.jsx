import { useEffect } from 'react';
import ReactPlayer from 'react-player'
import { logo2 } from '../assets'

const Logo = () => {

    useEffect(() => {
        function handleContextMenu(e) {
          e.preventDefault(); // prevents the default right-click menu from appearing
        }
        // add the event listener to the component's root element
        const rootElement = document.getElementById('logo');
        rootElement.addEventListener('contextmenu', handleContextMenu);
        // remove the event listener when the component is unmounted
    
        return () => {
          rootElement.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return(
        <ReactPlayer id="logo" url={logo2} playing={true} controls={false} playsinline={true} loop={true} muted={true} width={266} height={73} />
    )
}

export default Logo