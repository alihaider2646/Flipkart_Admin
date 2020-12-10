import React, { useState } from 'react';
// we using like this react fontawesome icons but if we want all our react fontwesome icons then we done like this that we do in our fontwaeomeicon folder
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const usePasswordToggle = () => {
    const [visible, setVisible] = useState(false);
    const Icon = (<FontAwesomeIcon style={{ color: "#2874f0" }} icon={visible ? 'eye-slash' : 'eye'} onClick={() => setVisible(visiblity => !visiblity)} />);
    const InputType = visible ? 'text' : 'password';
    return [InputType, Icon]
};

export default usePasswordToggle;