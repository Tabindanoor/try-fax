const  data = function
  (req, res) {
    res.status(200).json({ message: 'Hello from the serverless function!' });
  };
  
  export default data;
