// RANDOM POINT GENERATOR GIVEN A RECTANLE BOUNDING 
function points_for_hull(number_of_points,x_min,x_max,y_min,y_max)
{
    var points_array_initial = new Array();
    for ( var i = 0 ; i < number_of_points ;i++)
        {
            var x_coord_initial = (Math.random() * (x_max-x_min)) + x_min;
            var y_coord_initial = (Math.random() * (y_max-y_min)) + y_min;
            var z_coord = 0 ; 
            points_array_initial.push(new THREE.Vector3(Math.floor(x_coord_initial),Math.floor(y_coord_initial),Math.floor(z_coord)));  
    }
    return points_array_initial;
}

// DRAWING FUNCTION
function recall(convex_hull_arrays,color_mesh,speed,spread,line)
{
    var points,line ,mesh;
    var points_array = new Array();
    var convex_hull_points = new Array();

    // Motion of random points dervied from rendering and gui .Parameters of dependency are spread , progress and speed . 
    for (var t = 0; t<convex_hull_arrays.length;t++)
    {
        var x_coord = convex_hull_arrays[t].x + spread*Math.sin(5*t*progress*Math.PI/speed);
        var y_coord = convex_hull_arrays[t].y + spread*Math.cos(5*t*progress*Math.PI/speed);
        var z_coord = convex_hull_arrays[t].z;
        points_array.push(new THREE.Vector3(Math.floor(x_coord),Math.floor(y_coord),Math.floor(z_coord)));
    }


    convex_hull_points = convex_hull(points_array); // Draws convex hull 
    convex_hull_points.pop();
    points_array.pop();

    // Making Points
    var geometry_points = new THREE.Geometry();
    geometry_points.vertices = points_array;
    var dotMaterial = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false, color:color_mesh } );
    points = new THREE.Points(geometry_points, dotMaterial);

    //Making mesh 
    var holes = [];
    var triangles;
    var geometry_mesh = new THREE.Geometry();
    geometry_mesh.vertices = convex_hull_points;
    triangles = THREE.Shape.Utils.triangulateShape( convex_hull_points, holes ); // in built triangulation to make the mesh . 
    for(var triangle_face = 0 ; triangle_face<triangles.length ; triangle_face++)
    {
        geometry_mesh.faces.push(new THREE.Face3(triangles[triangle_face][0], triangles[triangle_face][1], triangles[triangle_face][2]));
    }
    var mesh_material = new THREE.MeshBasicMaterial({color: color_mesh, side: THREE.DoubleSide, opacity: 0.1, transparent: true, depthWrite: false});
    mesh = new THREE.Mesh(geometry_mesh,mesh_material);


    // Draw convex hull lines , only if the GUI says to 
    if(line)
    {
        var line_mesh = new THREE.Geometry();
        line_mesh.vertices = convex_hull_points;
        line_mesh.vertices.push(convex_hull_points[0]);
        var line_material = new THREE.LineBasicMaterial({color:color_mesh})
        line = new THREE.Line(line_mesh,line_material);
        scene.add(line);
    }

    scene.add(mesh);
    scene.add(points);
}

// FUNCTION TO REFRESH AT THE START OF EVERY FRAME. 
function update()
{   
    for(var b = 0 ; b < scene.children.length ; b++)
    {
    scene.children[b].material.dispose();
    scene.children[b].geometry.dispose();
    scene.remove(scene.children[b]);
    }

}

