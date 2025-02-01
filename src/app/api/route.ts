export default function SendMsg (req:any,res:any){
    console.log(req.body);
    
    res.status(200).json({ message: 'Fax sent successfully' });
    
}
