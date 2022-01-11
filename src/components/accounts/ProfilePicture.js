import React, { useState } from "react";
import { Paper, IconButton,} from "@mui/material";
import { Edit } from '@mui/icons-material/';

function ProfilePicture(props) {

    const [selectedImage, setSelectedImage] = useState('');

    const handleFileChange = (e) => {  
        if (e.target.files) {
            const image = Array.from(e.target.files)[0]
            const imageUrl = URL.createObjectURL(image);
            setSelectedImage(imageUrl);
            props.setUser({...props.user, image : image})
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ padding: 30, paddingTop: 55, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <input
                        accept="image/*"
                        style={{ display: "none" }}
                        multiple={false}
                        type="file"
                        id="button-file"
                        onChange={handleFileChange}
                    />
                    
                    <IconButton color="primary" component="span" style={{marginRight: -30}}>
                        <label htmlFor="button-file" style={{cursor: 'pointer', height: 24}}>
                            <Edit />
                        </label>
                    </IconButton>
                <Paper elevation={4} style={{padding: 30 }}>
                    <img src={ selectedImage ?  selectedImage : props.image ? props.image : "avatar_grey.png"} alt="" width="180px" height="180px" 
                    style={{borderRadius: '5px', }}
                    />
                </Paper>
            </div>
        </div>
    );
}

export default ProfilePicture;