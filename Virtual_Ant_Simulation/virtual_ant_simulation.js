function convex_hull(points_array)
{
    
    // CONVEX HULL USING GRAHAM SCAN 
    var convex_points_array = new Array();
    // STEP1 : Find the lowest y and lowest x coord point . Call it P0. P[y_coord_min_index] has the minimum y . 
    var y_coord_max = 0 ; 
    for ( var i = 0 ; i < points_array.length ; i ++)
    { 
        if(points_array[i].y>y_coord_max)
        {
            y_coord_max = points_array[i].y;
        }
    }
    var y_coord_min = y_coord_max;
    var y_coord_min_index = 0 ; 
    for( var i =0 ; i <points_array.length ; i ++)
    {
        if(points_array[i].y<y_coord_min)
        {
            y_coord_min = points_array[i].y;
            y_coord_min_index = i ; 
        }
    }

    // making the first element of array lowest y point
    var lowest_point = points_array[0];
    points_array[0]= points_array[y_coord_min_index];
    points_array[y_coord_min_index]= lowest_point;

    // STEP2 : Sort the array using the angle it makes with P[y_coord_min]. Calculate the angle using slope . // Replace by heap sort to make it more efficient 
    var angle_with_ymin = new Array();
    for ( var m = 1 ; m < points_array.length ; m++)
    {
        for ( var i = 1 ; i < points_array.length-1 ; i ++)
        {

            var tan_1 = -(points_array[i].x-points_array[0].x) / (points_array[i].y-points_array[0].y) ;
            var tan_2 = -(points_array[i+1].x-points_array[0].x) / (points_array[i+1].y-points_array[0].y) ;

             // what happens when tan_1 or tan_2 becomes infinity . Need to put that point at point_array[1] or point_array[point_array.length -1] . use splice 

            if(points_array[i].y-points_array[0].y==0)
            {
                
                if(points_array[i].x>points_array[0].x)
                {
                    points_array.splice(1,0,points_array[i]); // put this point at 1st array location .
                    points_array.splice(i+1,1); // remove this point from the current array location.
                }
                else if (points_array[i].x<points_array[0].x)
                {
                    points_array.splice(points_array.length-1,0,points_array[i]); // put this point at 1st array location .
                    points_array.splice(i,1); // remove this point from the current array location.
                }
            }

            else if (tan_1>tan_2)
            {
                var a = points_array[i];
                points_array[i]= points_array[i+1];
                points_array[i+1]=a;
            }
        }
    }

    //To connect the last point to the first point .
    points_array[points_array.length]=points_array[0];

    // STEP3 : Push P0, P1, P2 in a stack 
    convex_points_array.push(points_array[0]);
    convex_points_array.push(points_array[1]);
    convex_points_array.push(points_array[2]);
    //convex_points_array.pop() to remove topmost elements in case of left turn 
    
    // STEP4 : Performs Push and Pop operations on the stack depending on the angle it makes with the last element of the stack (left or right turn)
    for( var t = 3; t < points_array.length ;t++)
    {
        var cross_product = cross_product_of_vectors(convex_points_array,t);
        while(cross_product.z <= 0 )
        {
            convex_points_array.pop();
            cross_product = cross_product_of_vectors(convex_points_array,t);

        }
            convex_points_array.push(points_array[t]);
     }

    function cross_product_of_vectors(convex_points_array,t)
    {
        var a = new THREE.Vector3(convex_points_array[convex_points_array.length-1].x-convex_points_array[convex_points_array.length-2].x,
                                  convex_points_array[convex_points_array.length-1].y-convex_points_array[convex_points_array.length-2].y,
                                  convex_points_array[convex_points_array.length-1].z-convex_points_array[convex_points_array.length-2].z);
        //vector connecting the current and last point .
        var b = new THREE.Vector3(points_array[t].x-convex_points_array[convex_points_array.length-1].x,
                                  points_array[t].y-convex_points_array[convex_points_array.length-1].y,
                                  points_array[t].z-convex_points_array[convex_points_array.length-1].z);

        var cross_product = a.cross(b);
        return cross_product;
    }

    
    return convex_points_array;
   
}