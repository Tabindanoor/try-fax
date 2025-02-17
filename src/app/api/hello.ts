const  myfunc (){
    var x = 5;
    console.log(x);
    function nestedFunc(){
        console.log(x);
    }   
    nestedFunc();
}