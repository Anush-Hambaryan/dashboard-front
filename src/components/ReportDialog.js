import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, Button} from "@mui/material";

export default function ReportDialog({openReportDialog, setReportDialog, jobInDialog}) {

    const handleClose = () => {
        setReportDialog(false);
      };

    return (
        <div>
        <Dialog
            open={openReportDialog}
            onClose={handleClose}
        >
        <DialogTitle id="alert-dialog-title">
            <Typography variant="overline" style={{fontWeight: 'bold', fontSize: 18 }} color={jobInDialog.status == 'sold' ? 'secondary' : 'green'} >{jobInDialog.status} </Typography>
            </DialogTitle>
            <div id="alert-dialog-description" style={{display: 'flex', flexDirection: 'column', padding: 22}}>
                <div style={{display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <Typography color="black" variant="overline" style={{marginRight: 10, fontWeight: 'bold' }}>User:</Typography>
                    <Typography variant="subtitle2" style={{marginRight: 5, marginTop: -2,}}>{jobInDialog.owner?.first_name}</Typography>
                    <Typography variant="subtitle2" style={{marginTop: -2,}}>{jobInDialog.owner?.last_name}</Typography>
                </div>
                {jobInDialog.job_type && 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 10, fontWeight: 'bold' }}>Type:</Typography>
                        <Typography variant="subtitle2" style={{marginTop: -2,}}>{`Job ${jobInDialog.job_type}`}</Typography>
                    </div>
                }
                {jobInDialog.address &&
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Address:</Typography>
                        <Typography variant="subtitle2" >{jobInDialog.address}</Typography>
                    </div>
                }
                {(jobInDialog.job_type && jobInDialog.coords) && 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Latitdue:</Typography>
                        <Typography variant="subtitle2">{jobInDialog.coords[0]?.lat}</Typography>
                    </div>
                }
                {(jobInDialog.job_type && jobInDialog.coords) && 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Longitude:</Typography>
                        <Typography variant="subtitle2">{jobInDialog.coords[0]?.lng}</Typography>
                    </div>
                }
                {(jobInDialog.shape == 'circle' && jobInDialog.coords) && 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Center:</Typography>
                        <Typography variant="subtitle2">{`Lat: ${Math.round(jobInDialog.coords[0]?.lat *100)/100} \u00A0\u00A0 Lng: ${Math.round(jobInDialog.coords[0]?.lng *100)/100}`} </Typography>
                    </div>
                }
                {jobInDialog.shape == 'circle' && 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Radius:</Typography>
                        <Typography variant="subtitle2">{Math.round(jobInDialog.radius/1000*100)/100} km</Typography>
                    </div>
                }
                
                {(jobInDialog.shape == 'polygon' && jobInDialog.coords) &&
                jobInDialog.coords.map((item, i) => (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Vertex {i+1}:</Typography>
                        <Typography variant="subtitle2" key={i}>{`Lat: ${parseFloat(item.lat).toFixed(4)} \u00A0\u00A0\ Lng: ${parseFloat(item.lng).toFixed(4)}`}</Typography>
                    </div>
                ))
                }
                {jobInDialog.id && 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>ID:</Typography>
                        <Typography variant="subtitle2">{jobInDialog.id}</Typography>
                    </div>
                }
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Typography color="black" variant="overline" style={{marginRight: 12, fontWeight: 'bold' }}>Date:</Typography>
                    <Typography variant="subtitle2">{new Date(jobInDialog.created).toLocaleDateString()}</Typography>
                </div>
            </div>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}
