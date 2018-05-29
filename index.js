//GOOGLE MAPS KEY API
const KEY_MAPS = "AIzaSyB63_2wCGLLuvMadVGTh8oaaPKIcH67sBs";

//*****************************//
//URL OF THE DATASETS TO BE USED

//NEIGHBORHOOD NAMES GIS
const URL_NEIGHBORHOOD_NAMES_GIS =
  "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";

//NY DISTRICTS GEOSHAPES
const URL_POLYGON =
  "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";

//DATASET CRIMES IN NY - 12/31/2015
const URL_CRIMES_IN_NY =
  "https://data.cityofnewyork.us/resource/qgea-i56i.json?$where=cmplnt_fr_dt=%222015-12-31T00:00:00%22";

//DATASET CONTAINS INFORMATION ON NEW YORK CITY HOUSING BY BUILDING DATA
const URL_HOUSING_IN_NY =
  "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

//NEW YORK CITY MUSEUMS
const URL_MUSEUMS_IN_NY =
  "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
//*****************************//

//NEW YORK CITY GALLERY
const URL_GALLERY_IN_NY =
  "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";

//GLOBAL VARIABLES
//-*-*-*-*-*-*-*-*-*

//INPUT MAP ICON

//https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/mapaX.png
var input_map = {
  remove:
    "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/mapaX.png",
  get:
    "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/mapaY.png",
  state: true
};

//INPUT MUSEUM ICON
var input_museum = {
  remove:
    "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/museumY.png",
  get:
    "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/museumX.png",
  state: true
};

//INPUT GALLERY ICON

var input_gallery = {
  state: true
};

//INPUT CRIMES ICON
var input_crimes = {
  remove:
    "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/crimesY.png",
  get:
    "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/crimes-X.png",
  state: true
};

//MARKERS ICONS
var icons = {
  house: {
    icon: "http://maps.google.com/mapfiles/kml/pal2/icon10.png",
    name: "House"
  },
  museum: {
    icon: "https://es.newyorkpass.com/siteimg/googleMapIcons/55.png",
    name: "Museum"
  },
  neighborhood: {
    icon:
      "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/neighborhood.png",
    name: "Neighborhood"
  },
  gallery: {
    icon:
      "https://raw.githubusercontent.com/lmbaeza/ImageIronHacks/master/icon-gallery.png",
    name: "Gallery"
  }
};

//INSTANCE OF THE MAP
var map;

var countErr = 0;

//ARRAY OF MARKERS
var features = [],
  markers = [],
  housing = [],
  museums = [],
  heatMap = [],
  neighborhoodMarker = [],
  galleryMarker = [];

//MATRIX OF DISTANCES FROM THE DISTRICT TO THE NYU
var distanceMatrix = [];

//INSTANCES OF GOOGLE MAPS SERVICES
var directionsService, directionsRenderer;

//ARRAYS WITH THE DATASETS
var DATASET_HOUSING_IN_NY = [],
  DATASET_POLYGON = [],
  DATASET_CRIMES_IN_NY = [],
  DATASET_NEIGHBORHOOD_NAMES_GIS = [],
  DATASET_MUSEUMS_IN_NY = [],
  DATASET_GALLERY_IN_NY = [];

//INFORMATION OF THE BOROUGH
var district = {
  //NAME: NAME OF THE BOROUGH
  //NUMBER: DISTRICT NUMBER FOR EACH BOROUGH
  Bronx: { name: "Bronx", number: 12 },
  Brooklyn: { name: "Brooklyn", number: 18 },
  Manhattan: { name: "Manhattan", number: 12 },
  Queens: { name: "Queens", number: 14 },
  "Staten Island": { name: "Staten Island", number: 3 }
};

//DATA ON THE DISTANCE OF THE DISTRICTS
var district_distance = {
  Bronx: {
    name: "Bronx",
    distance: [],
    coordinate: [],
    average: 0,
    maximum: 0,
    minimum: 0,
    range: 0,
    stdDeviation: 0
  },
  Brooklyn: {
    name: "Brooklyn",
    distance: [],
    coordinate: [],
    average: 0,
    maximum: 0,
    minimum: 0,
    range: 0,
    stdDeviation: 0
  },
  Manhattan: {
    name: "Manhattan",
    distance: [],
    coordinate: [],
    average: 0,
    maximum: 0,
    minimum: 0,
    range: 0,
    stdDeviation: 0
  },
  Queens: {
    name: "Queens",
    distance: [],
    coordinate: [],
    average: 0,
    maximum: 0,
    minimum: 0,
    range: 0,
    stdDeviation: 0
  },
  "Staten Island": {
    name: "Staten Island",
    distance: [],
    coordinate: [],
    average: 0,
    maximum: 0,
    minimum: 0,
    range: 0,
    stdDeviation: 0
  }
};

//DATA ON POLYGONES
var borough_OBJECTID = {
  Bronx: {
    OBJECTID: [18, 19, 24, 14, 30, 31, 16, 43, 20, 53, 22, 28],
    districtID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    color: "#0000CD"
  },
  Brooklyn: {
    OBJECTID: [1, 4, 5, 6, 7, 8, 9, 11, 25, 49, 50, 52, 55, 56, 57, 61, 62, 71],
    districtID: [11, 14, 13, 10, 12, 16, 9, 4, 8, 1, 3, 5, 17, 18, 15, 6, 7, 2],
    color: "#3109FF"
  },
  Manhattan: {
    OBJECTID: [10, 37, 38, 39, 40, 41, 47, 48, 65, 66, 67, 68],
    districtID: [4, 3, 9, 12, 10, 7, 5, 6, 2, 8, 11, 1],
    color: "#191970"
  },
  Queens: {
    OBJECTID: [2, 13, 21, 27, 29, 32, 33, 35, 45, 46, 60, 63, 69, 70],
    districtID: [12, 2, 7, 14, 10, 9, 13, 3, 8, 11, 1, 5, 4, 6],
    color: "#00008B"
  },
  "Staten Island": {
    OBJECTID: [15, 64, 59],
    districtID: [3, 2, 1],
    color: "#1E90FF"
  },
  GreenBorough: {
    OBJECTID: [3, 12, 17, 23, 26, 42, 44, 51, 54, 58],
    color: "#2ab405"
  },
  else: {
    OBJECTID: [34, 36],
    color: "#cacbca"
  }
};

//COORDINATE NYU STERN SCHOOL OF BUSINESS
var initialCoordinates = { lat: 40.7291, lng: -73.9965 };

//FUNCTIONS

/**
 * FUNCTION TO INITIALIZE THE MAP
 */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: initialCoordinates,
    zoom: 10
  });
  var marker = new google.maps.Marker({
    position: initialCoordinates,
    map: map
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  var legend = document.getElementById("legend");
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement("div");
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  //DRAW THE POLYGONES ON THE MAP
  getMapFromGeoJsonInit();
}

/**
 * DRAW THE BEST ROUTE BETWEEN TWO COORDINATES
 */
function getRoute(destination, mode = "DRIVING") {
  var request = {
    origin: initialCoordinates,
    destination: destination,
    travelMode: mode
  };

  directionsRenderer.setMap(map);

  directionsService.route(request, function(result, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    }
  });
}

var loadFlag = true;
/**
 * THIS FUNCTION INITIALIZES THE POLYGONS ON THE MAP
 */
function getMapFromGeoJsonInit() {
  features = [];
  map.data.loadGeoJson(URL_POLYGON);

  //STYLES TO MAP POLYGONS
  map.data.setStyle(function(feature) {
    if (feature.f.OBJECTID === 19) {
      feature.b.b = [feature.b.b[2]];
    } else if (feature.f.OBJECTID === 68) {
      feature.b.b = [feature.b.b[3]];
    }

    if (features.length > 71) {
      features = features.splice(0, 70);
    }

    var colorBoroughJson = colorBorough(feature.f.OBJECTID);
    features.push(feature);
    return {
      fillColor: colorBoroughJson.color,
      strokeWeight: 0,
      fillOpacity: 0
    };
  });

  //IT RUNS ONCE WHEN THE MAP HAS FULLY LOADED
  google.maps.event.addListenerOnce(map, "tilesloaded", function() {
    //GET THE STATISTICS OF THE DISTANCES OF EACH DISTRICT
    if (loadFlag) {
      getDistanceMatrix(
        statistics,
        updateTableDistancesStatistics,
        updateTableDistances
      );

      setTimeout(function() {
        getDistanceMatrix(
          statistics,
          updateTableDistancesStatistics,
          updateTableDistances
        );
        graphLowIncomeUnits();
      }, 3500);

      setTimeout(function() {
        if (
          district_distance.Bronx.average == 0 ||
          district_distance.Brooklyn.average == 0 ||
          district_distance.Manhattan.average == 0 ||
          district_distance.Queens.average == 0 ||
          district_distance["Staten Island"].average == 0
        ) {
          getDistanceMatrix(
            statistics,
            updateTableDistancesStatistics,
            updateTableDistances
          );
          graphLowIncomeUnits();
        }
      }, 6000);

      loadFlag = !loadFlag;
    }
  });
}

/**
 * DRAW THE MAP WITH THE GEOJSON COORDINATES
 */
function getMapFromGeoJson() {
  features = [];
  map.data.loadGeoJson(URL_POLYGON);

  //STYLES TO MAP POLYGONS
  map.data.setStyle(function(feature) {
    if (feature.f.OBJECTID === 19) {
      feature.b.b = [feature.b.b[2]];
    } else if (feature.f.OBJECTID === 68) {
      feature.b.b = [feature.b.b[3]];
    }

    if (features.length > 71) {
      features = features.splice(0, 70);
    }
    var colorBoroughJson = colorBorough(feature.f.OBJECTID);
    features.push(feature);
    return {
      fillColor: colorBoroughJson.color,
      strokeWeight: 1,
      fillOpacity: 1
    };
  });
}

/**
 * CALCULATE THE DISTANCES FROM THE DISTRICTS TO THE NYU AND DRAW THE STATISTICS
 */
function getDistanceMatrix(callback1, callback2, callback3) {
  var service = new google.maps.DistanceMatrixService();
  initDistrictDistance();

  for (var i = 0; i < features.length; i++) {
    var key = getBoroughFromObjectid(features[i].f.OBJECTID).borough;

    if (district_distance[key]) {
      district_distance[key].coordinate.push({
        center: centerPolygon(features[i]),
        id: positionOBJECTID(features[i].f.OBJECTID, key),
        position: positionOBJECTID(features[i].f.OBJECTID, key)
      });
    }
  }

  var key = Object.keys(district_distance);

  for (var _key of key) {
    district_distance[_key].coordinate = orderByPosition(
      district_distance[_key].coordinate
    );
  }

  for (var i = 0; i < key.length; i++) {
    var origin = [];
    for (var j = 0; j < district_distance[key[i]].coordinate.length; j++) {
      origin.push(district_distance[key[i]].coordinate[j].center);
    }
    getDistance(origin, key[i]);
  }

  setTimeout(callback1, 700);
  setTimeout(callback2, 1100);
  setTimeout(callback3, 1100);
}

/**
 * ORDER ARRAY OF OBJECTS
 * @param {*} array
 */
function orderByPosition(array) {
  return array.sort(function(x1, x2) {
    return parseInt(x1.id) - parseInt(x2.id);
  });
}

/**
 * RETURNS THE NUMBER OF THE DISTRICT OF A BOROUGH
 * @param {*} objectId ID ID OF THE OBJECT
 * @param {*} boroughName NAME OF THE BOROUGH
 */
function positionOBJECTID(objectId, boroughName) {
  var arrayBorough = borough_OBJECTID[boroughName].OBJECTID;

  for (var i = 0; i < arrayBorough.length; i++) {
    if (arrayBorough[i] === objectId) {
      return borough_OBJECTID[boroughName].districtID[i];
    }
  }
  return -1;
}

/**
 * INITIALIZE THE DISTANCE ARRAYS
 */
function initDistrictDistance() {
  var keys = Object.keys(district_distance);

  for (var key of keys) {
    district_distance[key].distance = [];
    district_distance[key].coordinate = [];
  }
}

/**
 * RETURNS THE DISTANCE BETWEEN TWO COORDINATES
 * @param {*} origin COORDINATES OF ORIGIN
 * @param {*} key BOROUGH NAME
 */
function getDistance(origin, key) {
  var service = new google.maps.DistanceMatrixService();

  var options = {
    origins: origin,
    destinations: [initialCoordinates],
    travelMode: "DRIVING"
  };

  service.getDistanceMatrix(options, function(response, status) {
    //var x = response ? response.rows : null;
    //console.log(status, " - ", x);

    if (status === "OK") {
      district_distance[key].distance = response.rows;
    } else if (status === "INVALID_REQUEST") {
      if (countErr < 3) {
        getDistanceMatrix(
          statistics,
          updateTableDistancesStatistics,
          updateTableDistances
        );
      }
      countErr++;
    }
  });
}

/**
 * MINIMUM DISTANCE FROM ALL DISTRICTS OF A BOROUGH
 */
function min() {
  var keys = Object.keys(district_distance);
  for (var key of keys) {
    var dataMin = district_distance[key].distance;
    var min = Number.POSITIVE_INFINITY;
    for (var i = 0; i < dataMin.length; i++) {
      if (dataMin[i].elements[0].status == "OK") {
        if (dataMin[i].elements[0].distance.value < min) {
          min = dataMin[i].elements[0].distance.value;
        }
      }
    }
    district_distance[key].minimum = min;
    if (district_distance[key].minimum === Number.POSITIVE_INFINITY) {
      district_distance[key].minimum = 0;
    }
  }
}

/**
 * MAXIMUM DISTANCE FROM ALL DISTRICTS OF A BOROUGH
 */
function max() {
  var keys = Object.keys(district_distance);
  for (var key of keys) {
    var dataMax = district_distance[key].distance;
    var max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < dataMax.length; i++) {
      if (dataMax[i].elements[0].status == "OK") {
        if (dataMax[i].elements[0].distance.value > max) {
          max = dataMax[i].elements[0].distance.value;
        }
      }
    }
    district_distance[key].maximum = max;
    if (district_distance[key].maximum === Number.NEGATIVE_INFINITY) {
      district_distance[key].maximum = 0;
    }
  }
}

/**
 * DISTANCE AVERAGE OF ALL DISTRICTS OF A BOROUGH
 */
function average() {
  var keys = Object.keys(district_distance);
  for (var key of keys) {
    var dataMax = district_distance[key].distance;
    var sum = 0,
      n = 0;
    for (var i = 0; i < dataMax.length; i++) {
      if (dataMax[i].elements[0].status == "OK") {
        sum += dataMax[i].elements[0].distance.value;
        n++;
      }
    }
    district_distance[key].average = Math.round(sum / n * 100) / 100;

    if (isNaN(district_distance[key].average)) {
      district_distance[key].average = 0;
    }
  }
}

/**
 * RANGE OF DISTANCES OF ALL DISTRICTS OF A BOROUGH
 */
function range() {
  var keys = Object.keys(district_distance);
  for (var key of keys) {
    district_distance[key].range =
      district_distance[key].maximum - district_distance[key].minimum;
  }
}

/**
 * STANDARD DEVIATION OF THE DISTANCES OF ALL DISTRICTS OF A BOROUGH
 */
function stdDesv() {
  var keys = Object.keys(district_distance);
  for (var key of keys) {
    var dataMax = district_distance[key].distance;
    var xX = [];
    var n = 0;

    for (var i = 0; i < dataMax.length; i++) {
      if (dataMax[i].elements[0].status == "OK") {
        xX.push(
          (dataMax[i].elements[0].distance.value -
            district_distance[key].average) **
            2
        );
        n++;
      }
    }

    var result = 0;
    for (var j = 0; j < xX.length; j++) {
      result += xX[j];
    }

    if (n != 0) {
      district_distance[key].stdDeviation =
        Math.round(Math.sqrt(result / n) * 1000) / 1000;
    } else {
      district_distance[key].stdDeviation = 0;
    }
  }
}

/**
 * EXECUTE STATISTICS
 */
function statistics() {
  min();
  max();
  average();
  range();
  stdDesv();
}

/**
 * FORMAT OF THE DISTANCES
 * @param {*} data DISTANCE
 */
function formatDistance(data) {
  return (
    parseFloat(data.toString().replace(/,/g, ""))
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " m"
  );
}

/**
 *
 */
function updateTableDistancesStatistics() {
  var select = $("#select-table-distance");
  var valueSelect = select.val() === "default" ? "Bronx" : select.val();

  var headTableStat = $("#head-distance-statistics");
  var bodyTableStat = $("#body-distance-statistics")[0];

  headTableStat.html(
    '<tr><th colspan="2" class="text-center">' + valueSelect + "</th> </tr>"
  );

  var newRow, name, value;
  var items = ["average", "maximum", "minimum", "range", "stdDeviation"];

  var itemsName = [
    "Average",
    "Maximum",
    "Minimum",
    "Range",
    "Standard Deviation"
  ];

  $("#body-distance-statistics").empty();

  for (var i = 0; i < items.length; i++) {
    newRow = bodyTableStat.insertRow(bodyTableStat.rows.length);
    name = newRow.insertCell(0);
    value = newRow.insertCell(1);

    name.innerHTML = itemsName[i];

    value.innerHTML = formatDistance(district_distance[valueSelect][items[i]]);
    value.className = "text-center";
  }
}

/**
 *
 */
function updateTableDistances() {
  var select = $("#select-table-distance");
  var valueSelect = select.val() === "default" ? "Bronx" : select.val();

  var bodyTableDistrict = $("#body-distance-district")[0];

  var newRow, number, numberDistrict, distance;

  var dataDistance = district_distance[valueSelect].distance;
  $("#body-distance-district").empty();

  for (var i = 0; i < dataDistance.length; i++) {
    newRow = bodyTableDistrict.insertRow(bodyTableDistrict.rows.length);
    number = newRow.insertCell(0);
    numberDistrict = newRow.insertCell(1);
    distance = newRow.insertCell(2);

    number.innerHTML = i + 1;
    numberDistrict.innerHTML =
      valueSelect +
      " - " +
      "District " +
      district_distance[valueSelect].coordinate[i].position;

    if (dataDistance[i].elements[0].status == "OK") {
      distance.innerHTML = formatDistance(
        dataDistance[i].elements[0].distance.value
      );
    } else {
      distance.innerHTML = "Not found";
    }
  }
  graphDistanceD3();
  bestDistanceDistrict();
}

/**
 * RETURN THE COLOR IN THE DIFFERENT DISTRICTS ACCORDING TO THE BOROUGH
 */
function colorBorough(id) {
  var borough_key = Object.keys(borough_OBJECTID);

  for (var key of borough_key) {
    var arr = borough_OBJECTID[key].OBJECTID;
    for (var i = 0; i < arr.length; i++) {
      if (id == arr[i]) {
        return {
          response: true,
          color: borough_OBJECTID[key].color
        };
      }
    }
  }
  return { response: false, color: undefined };
}

/**
 * RETURNS THE BOROUGH HAVING AN OBJECTID
 */
function getBoroughFromObjectid(id) {
  var borough_key = Object.keys(borough_OBJECTID);

  for (var key of borough_key) {
    var arr = borough_OBJECTID[key].OBJECTID;
    for (var i = 0; i < arr.length; i++) {
      if (id == arr[i]) {
        return {
          response: true,
          borough: key
        };
      }
    }
  }
  return { response: false, borough: undefined };
}

/**
 * REMOVE THE MAP WITH GEOJSON COORDINATES
 */
function removePolygon() {
  for (var feature of features) {
    map.data.remove(feature);
  }
}

/**
 * CHANGE THE IMAGE ICON MAPS
 */
function getAndRemoveMap() {
  if (input_map.state) {
    getMapFromGeoJson();
    $("#input-map").attr("src", input_map.get);
    input_map.state = false;
  } else {
    getMapFromGeoJsonInit();
    $("#input-map").attr("src", input_map.remove);
    input_map.state = true;
  }
}

/**
 * RETURNS THE COORDINATES OF THE CENTER OF THE POLYGON
 * @param {*} feature
 */
function centerPolygon(feature) {
  var bounds = new google.maps.LatLngBounds();
  var arr = [];
  try {
    if (feature.b.b[0]) {
      for (var coor of feature.b.b[0].b) {
        arr.push({
          lat: coor.lat(),
          lng: coor.lng()
        });
      }
      for (var j = 0; j < arr.length; j++) {
        bounds.extend(arr[j]);
      }
    }
  } catch (err) {
    if (feature.b.b[0]) {
      for (var coor of feature.b.b[0].b[0].b) {
        arr.push({
          lat: coor.lat(),
          lng: coor.lng()
        });
      }
      for (var j = 0; j < arr.length; j++) {
        bounds.extend(arr[j]);
      }
    }
  }

  //COORDINATES THE CENTER OF THE POLYGON
  return {
    lat: bounds.getCenter().lat(),
    lng: bounds.getCenter().lng()
  };
}

/**
 * REMOVE THE MAP MARKER
 * @param {*} position: MARKER POSITION
 */
function deleteMarker(position) {
  for (var marker of markers) {
    if (
      marker.position.lat() === position.lat &&
      marker.position.lng() === position.lng
    ) {
      marker.setMap(null);
    }
  }
}

/**
 * GET THE DATASET OF HOUSING IN NY
 */
function getDataHousing() {
  var data = $.get(URL_HOUSING_IN_NY, function() {})
    .done(function() {
      deleteHousing();
      for (var i of data.responseJSON.data) {
        DATASET_HOUSING_IN_NY.push({
          borough: i[15], //barrio - localidad
          communityBoard: {
            content: i[19],
            abbreviation: i[19].split("-")[0],
            numberDistrict: parseInt(i[19].split("-")[1])
          }, //numero del distrito
          lat: parseFloat(i[23]), //latitude
          lng: parseFloat(i[24]), //longitude
          latitude: parseFloat(i[25]), //latitude - internal
          longitude: parseFloat(i[26]), //longitude - internal
          lowIncomeUnits: parseInt(i[33]), //unidad de bajos ingresos
          extremelyLowIncomeUnits: parseInt(i[31]),
          address: i[14],
          projectName: i[9]
        });
      }
    })
    .fail(function(err) {
      console.log("Error : ", err);
    });
}

/**
 * GRAPH THE HOUSES ON THE MAP
 */
function graphHousing() {
  for (var house of DATASET_HOUSING_IN_NY) {
    if (
      house.borough === $("#selectDistrict").val() &&
      house.communityBoard.numberDistrict == this.value
    ) {
      var point = {
        lat: house.lat,
        lng: house.lng
      };

      var marker_house = new google.maps.Marker({
        position: point,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: icons.house.icon,
        data: {
          name: house.projectName,
          address: house.address,
          borough: house.borough
        }
      });

      google.maps.event.addListener(marker_house, "click", function() {
        var content = `
        <h6>NAME: ${this.data.name}</h6><br>
        <strong><u>ADDRESS:</u> </strong>${this.data.address}<br>
        <strong><u>BOROUGH:</u> </strong>${this.data.borough}<br>
        `;
        var infowindow = new google.maps.InfoWindow({
          content: content
        });

        infowindow.open(map, this);
      });

      housing.push(marker_house);
    }
  }
}

/**
 * SEARCH FOR HOUSING
 */
function housingSearch() {
  var scrollLeft = $(".scroll-list-left");
  setTimeout(function() {
    scrollLeft.scrollTop(1000);
  }, 250);

  $("#numberDistrict").hide();
}

/**
 * SELECT THE DISTRICT WHERE HOUSING IS LOCATED
 */
function selectDistrict() {
  $('#selectDistrict option[value="default"]').remove();

  var numberDistrict = $("#numberDistrict");

  //Delete all options except first option
  $("#selectNumberDistrict")
    .children("option:not(:first)")
    .remove();

  for (var i = 1; i < district[this.value].number + 1; i++) {
    $("#selectNumberDistrict").append(
      $("<option>", {
        value: i,
        text: district[this.value].name + " - District - " + i
      })
    );
  }

  numberDistrict.show();

  setTimeout(function() {
    var scrollLeft = $(".scroll-list-left");
    scrollLeft.scrollTop(1000);
  }, 250);

  getDataHousing();
}

/**
 * REMOVE THE HOUSING MARKERS
 */
function deleteHousing() {
  for (var marker_house of housing) {
    marker_house.setMap(null);
  }
  housing = [];
}

/**
 * OBTAIN THE DATASET WITH THE MUSEUM DATA
 */
function getDataMuseums() {
  var data = $.get(URL_MUSEUMS_IN_NY, function() {})
    .done(function() {
      for (var museum of data.responseJSON.data) {
        var coordinate_museum = getCoordenate(museum[8]);
        DATASET_MUSEUMS_IN_NY.push({
          position: coordinate_museum, //lat - lng
          name: museum[9],
          website: museum[11],
          address: museum[12],
          city: museum[14],
          zip: museum[15] //zip - codigo postal
        });
      }
      graphMuseum();
    })
    .fail(function(err) {
      console.log("Error : ", err);
    });
}

/**
 * DRAW THE MUSEUM MARKERS ON THE MAP
 */
function graphMuseum() {
  var input = $("#input-museum");

  if (input_museum.state) {
    for (var museum of DATASET_MUSEUMS_IN_NY) {
      var marker = new google.maps.Marker({
        position: museum.position,
        map: map,
        icon: icons.museum.icon,
        data: {
          name: museum.name,
          address: museum.address,
          website: museum.website
        }
      });
      museums.push(marker);

      google.maps.event.addListener(marker, "click", function() {
        var content = `
        <h6>NAME: ${this.data.name}</h6><br>
        <strong><u>ADDRESS:</u> </strong>${this.data.address}<br>
        <strong><u>MUSEUM:</u> </strong>${this.data.website}<br>
      `;
        var infowindow = new google.maps.InfoWindow({
          content: content
        });

        infowindow.open(map, this);
      });
    }
    input.attr("src", input_museum.remove);
    input_museum.state = false;
  } else {
    removeMuseumMarker();
    input.attr("src", input_museum.get);
    input_museum.state = true;
  }
}

/**
 * REMOVE THE MUSEUM MARKERS ON THE MAP
 */
function removeMuseumMarker() {
  for (var museum of museums) {
    museum.setMap(null);
  }
  museums = [];
}

/**
 * OBTAIN FORMORD COORDINATES POINT(######, ######)
 * @param {*} str
 */
function getCoordenate(str) {
  var component = str.split(" ");
  var component = component.splice(1, component.length);

  component[0] = component[0].substr(1, component[0].length);
  component[1] = component[1].substr(0, component[1].length - 1);

  return {
    lat: parseFloat(component[1]),
    lng: parseFloat(component[0])
  };
}

/**
 * OBTAIN THE DATASET WITH THE CRIME DATA IN NEW YORK OF THE DAY 31/12/2015
 */
function getDataCrimes() {
  var data = $.get(URL_CRIMES_IN_NY, function() {})
    .done(function() {
      DATASET_CRIMES_IN_NY = data.responseJSON;
      orderGraphicCrimes();
      graphD3js();
      updateTableCrimes();
    })
    .fail(function(err) {
      console.log("Error : ", err);
    });
}

/**
 * DRAW THE HEAT MAP OF DISTRICT CRIMES
 */
function graphCrimes() {
  if (input_crimes.state) {
    var heatMapData = [];
    for (var crimes of DATASET_CRIMES_IN_NY) {
      if (
        !isNaN(
          parseFloat(crimes.latitude) && isNaN(parseFloat(crimes.longitude))
        )
      ) {
        heatMapData.push(
          new google.maps.LatLng(
            parseFloat(crimes.latitude),
            parseFloat(crimes.longitude)
          )
        );
      }
    }

    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData,
      map: map
    });

    heatMap.push(heatmap);
    input_crimes.state = false;
    $("#input-crimes").attr("src", input_crimes.remove);
  } else {
    removeHeatMap();
    input_crimes.state = true;
    $("#input-crimes").attr("src", input_crimes.get);
  }
}

/**
 * REMOVE THE HEAT MAP
 */
function removeHeatMap() {
  for (var crime of heatMap) {
    crime.setMap(null);
  }
  heatMap = [];
}

/**
 * ORDERS CRIME DATASET DATA
 */
function orderGraphicCrimes() {
  var borough = {};
  DATASET_CRIMES_IN_NY.forEach(function(data) {
    if (borough[data.boro_nm]) {
      borough[data.boro_nm] = borough[data.boro_nm] + 1;
    } else {
      borough[data.boro_nm] = 1;
    }
  });
  var arr = Object.keys(borough);

  var retorno = [];
  for (var i of arr) {
    retorno.push({
      name: i,
      data: borough[i]
    });
  }
  return retorno;
}

/**
 *UPDATE THE DATA FROM THE CRIME TABLE
 */
function updateTableCrimes() {
  var dataCrimes = orderGraphicCrimes();
  var bodyCrimes = $("#body-table-crimes")[0];

  $("#body-table-crimes").empty();
  var newRow, nameBorough, numberCrimes;

  for (var i = 0; i < dataCrimes.length; i++) {
    newRow = bodyCrimes.insertRow(bodyCrimes.rows.length);
    number = newRow.insertCell(0);
    nameBorough = newRow.insertCell(1);
    numberCrimes = newRow.insertCell(2);

    number.innerHTML = i + 1;
    nameBorough.innerHTML = dataCrimes[i].name;
    numberCrimes.innerHTML = dataCrimes[i].data;
  }
}

/**
 * GRAPH THE CRIMES BY BOROUGH
 */
function graphD3js() {
  var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right - 100,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dataCrimes = orderGraphicCrimes();

  dataCrimes.forEach(function(data) {
    x.domain(
      dataCrimes.map(function(d) {
        return d.name;
      })
    );

    y.domain([
      0,
      d3.max(dataCrimes, function(d) {
        return d.data;
      })
    ]);

    g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Crimes");

    g
      .selectAll(".bar")
      .data(orderGraphicCrimes())
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.name);
      })
      .attr("y", function(d) {
        return y(d.data);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.data);
      });
  });
}

function itemStatistic(val) {
  var district_return = [];
  var key = Object.keys(district_distance);

  for (var i = 0; i < key.length; i++) {
    district_return.push({
      borough: district_distance[key[i]].name,
      value: district_distance[key[i]][val]
    });
  }
  return district_return;
}

var district_number = {
  BX: {},
  BK: {},
  QN: {},
  MN: {},
  SI: {}
};

function getNeighborhoods() {
  district_number = {
    BX: {},
    BK: {},
    QN: {},
    MN: {},
    SI: {}
  };

  var district_Housing = {
    BX: [],
    BK: [],
    QN: [],
    MN: [],
    SI: []
  };

  for (var house of DATASET_HOUSING_IN_NY) {
    district_Housing[house.communityBoard.abbreviation].push(house);
  }

  for (var district_abrr in district_Housing) {
    for (var district_n of district_Housing[district_abrr]) {
      var _ = district_number[district_abrr][district_n.communityBoard.content];
      if (_ === undefined) {
        district_number[district_abrr][district_n.communityBoard.content] = [
          district_n
        ];
      } else {
        district_number[district_abrr][district_n.communityBoard.content].push(
          district_n
        );
      }
    }
  }

  for (var number in district_number) {
    for (var district_n in district_number[number]) {
      district_number[number][district_n] = orderBylowIncomeUnits(
        district_number[number][district_n]
      );
    }
  }
}

function updateTableLowIncomeUnits() {
  getNeighborhoods();
  var select = $("#select-table-lowIncomeUnits");
  var valueSelect = select.val();
  var table = $("#body-lowIncomeUnits")[0];
  var newRow, number, name, average, maximum, range, standardDeviation;

  $("#body-lowIncomeUnits").empty();

  var i = 1;

  for (var row in statistic_LowIncomeUnits[valueSelect]) {
    newRow = table.insertRow(table.rows.length);
    number = newRow.insertCell(0);
    name = newRow.insertCell(1);
    average = newRow.insertCell(2);
    maximum = newRow.insertCell(3);
    standardDeviation = newRow.insertCell(4);
    range = newRow.insertCell(5);
    if (i < 10) {
      var key = row.split("-")[0] + "-0" + i;
    } else {
      var key = row.split("-")[0] + "-" + i;
    }

    number.innerHTML = i;
    i++;
    name.innerHTML = key;

    average.innerHTML = parseFloat(
      statistic_LowIncomeUnits[valueSelect][key].average
    ).toFixed(2);
    maximum.innerHTML = statistic_LowIncomeUnits[valueSelect][key].maximum;
    standardDeviation.innerHTML = parseFloat(
      statistic_LowIncomeUnits[valueSelect][key].standardDeviation
    ).toFixed(2);
    range.innerHTML = statistic_LowIncomeUnits[valueSelect][key].range;
  }
}

function numberOption(district_abrr) {
  if (district_abrr === "BX") {
    return { number: 12, name: "Bronx" };
  } else if (district_abrr === "BK") {
    return { number: 18, name: "Brooklyn" };
  } else if (district_abrr === "QN") {
    return { number: 14, name: "Queens" };
  } else if (district_abrr === "MN") {
    return { number: 12, name: "Manhattan" };
  } else if (district_abrr === "SI") {
    return { number: 3, name: "Staten Island" };
  } else {
    return { number: 0, name: undefined };
  }
}

function orderBylowIncomeUnits(array) {
  return array.sort(function(x1, x2) {
    return x1.lowIncomeUnits - x2.lowIncomeUnits;
  });
}

var statistic_LowIncomeUnits = {
  BX: {},
  BK: {},
  QN: {},
  MN: {},
  SI: {}
};

function graphLowIncomeUnits() {
  getNeighborhoods();
  updateTableLowIncomeUnits();

  for (var row in district_number) {
    for (var row_n in district_number[row]) {
      if (statistic_LowIncomeUnits[row][row_n] === undefined) {
        if (row_n !== "BK-304") {
          statistic_LowIncomeUnits[row][row_n] = [];
          var length = district_number[row][row_n].length - 1;
          var max = district_number[row][row_n][length].lowIncomeUnits;
          var min = district_number[row][row_n][0].lowIncomeUnits;

          var sum = district_number[row][row_n].reduce(function(prev, cur) {
            return prev + cur.lowIncomeUnits;
          }, 0);

          var std = standardDeviation(district_number[row][row_n]);

          statistic_LowIncomeUnits[row][row_n] = {
            labelValue: row_n,
            maximum: max,
            average: sum / (length + 1),
            range: max - min,
            standardDeviation: std
          };
        }
      }
    }
  }
  updateTableLowIncomeUnits();
  initGraphD3LowIncomeUnits();
}

function orderlowIncomeUnitsByName(array) {
  return array.sort(function(x1, x2) {
    return (
      parseInt(x1.labelValue.splice("-")[1]) -
      parseInt(x2.labelValue.splice("-")[1])
    );
  });
}

function sum(array) {
  var num = 0;
  for (var i = 0; i < array.length - 1; i++) {
    if (array[i].lowIncomeUnits) {
      num += array[i].lowIncomeUnits;
    }
  }
  return num;
}

function sumArr(array) {
  var num = 0;
  for (var i = 0; i < array.length - 1; i++) {
    num += array[i];
  }
  return num;
}

function mean(array) {
  return sum(array) / array.length;
}

function meanValue(array) {
  return sumArr(array) / array.length;
}

function variance(array) {
  var meanNumber = mean(array);

  var pow = array.map(function(num) {
    return Math.pow(num.lowIncomeUnits - meanNumber, 2);
  });
  return meanValue(pow);
}

function standardDeviation(array) {
  return Math.sqrt(variance(array));
}

function getDataNeighborhood() {
  var data = $.get(URL_NEIGHBORHOOD_NAMES_GIS, function() {})
    .done(function() {
      for (var row of data.responseJSON.data) {
        DATASET_NEIGHBORHOOD_NAMES_GIS.push({
          OBJECTID: row[8],
          position: getCoordenate(row[9]),
          name: row[10],
          borough: row[16]
        });
      }
    })
    .fail(function(err) {
      console.log("Error : ", err);
    });
}

function graphNeighborhoods() {
  var selectValue = $(this).text();

  if (selectValue === "Remove") {
    removeNeighborhoodMarker();
    return;
  }
  removeNeighborhoodMarker();

  for (var neighborhood of DATASET_NEIGHBORHOOD_NAMES_GIS) {
    if (neighborhood.borough === selectValue) {
      var marker = new google.maps.Marker({
        position: neighborhood.position,
        map: map,
        icon: { url: icons.neighborhood.icon },
        title: neighborhood.name,
        data: {
          name: neighborhood.name,
          borough: neighborhood.borough
        }
      });
      neighborhoodMarker.push(marker);

      google.maps.event.addListener(marker, "click", function() {
        var content = `
        <h6>NEIGHBORHOOD: ${this.data.name}</h6><br>
        <strong><u>BOROUGH:</u> </strong>${this.data.borough}<br>
      `;
        var infowindow = new google.maps.InfoWindow({
          content: content
        });

        infowindow.open(map, this);
      });
    }
  }
}

function removeNeighborhoodMarker() {
  for (var row of neighborhoodMarker) {
    row.setMap(null);
  }
  neighborhoodMarker = [];
}

function getDataGallery() {
  var data = $.get(URL_GALLERY_IN_NY, function() {})
    .done(function() {
      for (var row of data.responseJSON.data) {
        DATASET_GALLERY_IN_NY.push({
          name: row[8],
          position: getCoordenate(row[9]),
          phoneNumber: row[10],
          webSite: row[11],
          address: row[12]
        });
      }
    })
    .fail(function(err) {
      console.log("Error : ", err);
    });
}

function graphGallery() {
  if (input_gallery.state) {
    removerMarkerGallery();

    for (var row of DATASET_GALLERY_IN_NY) {
      var marker = new google.maps.Marker({
        position: row.position,
        map: map,
        icon: icons.gallery.icon,
        data: {
          name: row.name,
          address: row.address,
          webSite: row.webSite,
          phoneNumber: row.phoneNumber
        }
      });

      google.maps.event.addListener(marker, "click", function() {
        var content = `
        <h6>NAME: ${this.data.name}</h6><br>
        <strong><u>ADDRESS:</u> </strong>${this.data.address}<br>
        <strong><u>WEBSITE:</u> </strong>${this.data.webSite}<br>
        <strong><u>PHONE NUMBER:</u> </strong>${this.data.phoneNumber}<br>
        `;
        var infowindow = new google.maps.InfoWindow({
          content: content
        });

        infowindow.open(map, this);
      });

      galleryMarker.push(marker);
    }
    input_gallery.state = false;
  } else {
    removerMarkerGallery();
    input_gallery.state = true;
  }
}

function removerMarkerGallery() {
  for (var row of galleryMarker) {
    row.setMap(null);
  }
  galleryMarker = [];
}

//---------------------------------------------
var number_crimes = {
  Bronx: {},
  Brooklyn: {},
  Manhattan: {},
  Queens: {},
  "Staten Island": {}
};

var polygons = [];

function orderDataCrimes() {
  polygons = [];
  for (var row of features) {
    if (row.b.b[0].b[0].b) {
      var _polygon = new google.maps.Polygon({
        paths: row.b.b[0].b[0].b
      });
      polygons.push({
        polygon: _polygon,
        feature: row
      });
    } else if (row.b.b[0].b) {
      var _polygon = new google.maps.Polygon({
        paths: row.b.b[0].b
      });
      polygons.push({
        polygon: _polygon,
        feature: row
      });
    }
  }
}

function bestCrimes() {
  //main crimes
  orderDataCrimes();

  for (var row of DATASET_CRIMES_IN_NY) {
    for (var polygon of polygons) {
      if (
        //if the coordinate is on the polygon
        google.maps.geometry.poly.containsLocation(
          new google.maps.LatLng(
            parseFloat(row.latitude),
            parseFloat(row.longitude)
          ),
          polygon.polygon
        )
      ) {
        //execute
        var element =
          number_crimes[capitalize(row.boro_nm)][
            numberDistrictCrimes(
              abbr[capitalize(row.boro_nm)],
              positionOBJECTID(
                polygon.feature.f.OBJECTID,
                capitalize(row.boro_nm)
              )
            )
          ];

        if (element === undefined) {
          number_crimes[capitalize(row.boro_nm)][
            numberDistrictCrimes(
              abbr[capitalize(row.boro_nm)],
              positionOBJECTID(
                polygon.feature.f.OBJECTID,
                capitalize(row.boro_nm)
              )
            )
          ] = 1;
        } else {
          number_crimes[capitalize(row.boro_nm)][
            numberDistrictCrimes(
              abbr[capitalize(row.boro_nm)],
              positionOBJECTID(
                polygon.feature.f.OBJECTID,
                capitalize(row.boro_nm)
              )
            )
          ] =
            element + 1;
        }
        break;
      }
    }
  }
  best10Crimes();
}

var bestCrimesNY = [];

var best10CrimesNY = [];

function best10Crimes() {
  bestCrimesNY = [];
  best10CrimesNY = [];

  for (var row in number_crimes) {
    for (var rowDistrict in number_crimes[row]) {
      bestCrimesNY.push({
        district: rowDistrict,
        number: number_crimes[row][rowDistrict]
      });
    }
  }
  bestCrimesNY = sortBest10Crimes(bestCrimesNY);

  var i = 0;
  for (var row of bestCrimesNY) {
    if (row.district !== "undefined" && i < 10) {
      best10CrimesNY.push(row);
      i++;
    }
  }
}
//TODO:

function numberCrimesByDistrict() {
  $("#content-crimes-table").show();
  var val = $("input[name=select-table-crimes]:checked").val();

  var table = $("#body-crimes-district")[0];
  var newRow, numberRow, nDistrict, numberOfCrimes;
  var index = 1;

  var n = district[abbr[val]].number;

  $("#body-crimes-district").empty();

  for (var i = 1; i < n + 1; i++) {
    var key = i < 10 ? val + "-0" + i : val + "-" + i;
    for (var row of bestCrimesNY) {
      if (row.district == key) {
        newRow = table.insertRow(table.rows.length);
        numberRow = newRow.insertCell(0);
        nDistrict = newRow.insertCell(1);
        numberOfCrimes = newRow.insertCell(2);
        numberRow.innerHTML = index;
        nDistrict.innerHTML = row.district;
        numberOfCrimes.innerHTML = row.number + " Crimes";
        index++;
        break;
      }
    }
  }
}

function sortBest10Crimes(array) {
  return array.sort(function(x1, x2) {
    return x1.number - x2.number;
  });
}

function numberDistrictCrimes(abbreviation, number) {
  if (number == -1) {
    return undefined;
  }
  if (number < 10) {
    return abbreviation + "-0" + number;
  } else {
    return abbreviation + "-" + number;
  }
}

function capitalize(str) {
  str = str.toLocaleLowerCase();
  char = str[0].toLocaleUpperCase();
  return char + str.slice(1, str.length);
}

var bestDistance = [];

function bestDistanceDistrict() {
  bestDistance = [];
  for (var row in district_distance) {
    for (var i = 0; i < district_distance[row].distance.length; i++) {
      district_distance[row].distance[i].elements[0].borough = row;
      district_distance[row].distance[i].elements[0].number =
        district_distance[row].coordinate[i].position;
      bestDistance.push(district_distance[row].distance[i]);
    }
  }

  bestDistance = sortBest(bestDistance);

  bestDistance = bestDistance.splice(0, 10);
}

function sortBest(array) {
  return array.sort(function(x1, x2) {
    return x1.elements[0].distance.value - x2.elements[0].distance.value;
  });
}

var bestLowIncomeUnits = [];

function best10LowIncomeUnits() {
  bestLowIncomeUnits = [];

  var keys = Object.keys(statistic_LowIncomeUnits);
  for (var key of keys) {
    for (var row in statistic_LowIncomeUnits[key]) {
      bestLowIncomeUnits.push(statistic_LowIncomeUnits[key][row]);
    }
  }

  bestLowIncomeUnits = sortBestLowIncomeUnits(bestLowIncomeUnits).splice(0, 10);
}

function sortBestLowIncomeUnits(array) {
  return array.sort(function(x1, x2) {
    return x1.average - x2.average;
  });
}

function formatLowIncomeUnits(numberFloat) {
  return parseFloat(numberFloat.toFixed(2));
}
var abbr = {
  Bronx: "BX",
  Brooklyn: "BK",
  Manhattan: "MN",
  Queens: "QN",
  "Staten Island": "SI",
  BX: "Bronx",
  BK: "Brooklyn",
  MN: "Manhattan",
  QN: "Queens",
  SI: "Staten Island"
};

var best3District = [];

function best3() {
  best10LowIncomeUnits();
  best3District = [];
  var tmp = {};

  var i = 1;
  for (var row of bestDistance) {
    if (row.elements[0].number < 10) {
      if (
        tmp[abbr[row.elements[0].borough] + "-0" + row.elements[0].number] ===
        undefined
      ) {
        tmp[abbr[row.elements[0].borough] + "-0" + row.elements[0].number] = {
          value: i,
          number: 1
        };
      } else {
        var _value =
          tmp[abbr[row.elements[0].borough] + "-0" + row.elements[0].number]
            .value + j;
        var _number =
          tmp[abbr[row.elements[0].borough] + "-0" + row.elements[0].number]
            .number + 1;

        tmp[abbr[row.elements[0].borough] + "-0" + row.elements[0].number] = {
          value: _value,
          number: _number
        };
      }
    } else {
      if (
        tmp[abbr[row.elements[0].borough] + "-" + row.elements[0].number] ===
        undefined
      ) {
        tmp[abbr[row.elements[0].borough] + "-" + row.elements[0].number] = {
          value: i,
          number: 1
        };
      } else {
        var _value =
          tmp[abbr[row.elements[0].borough] + "-" + row.elements[0].number]
            .value + j;
        var _number =
          tmp[abbr[row.elements[0].borough] + "-" + row.elements[0].number]
            .number + 1;

        tmp[abbr[row.elements[0].borough] + "-" + row.elements[0].number] = {
          value: _value,
          number: _number
        };
      }
    }
    i++;
  }

  var j = 1;
  for (var row of best10CrimesNY) {
    if (tmp[row.district] === undefined) {
      tmp[row.district] = {
        value: j,
        number: 1
      };
    } else {
      var _value = tmp[row.district].value + j;
      var _number = tmp[row.district].number + 1;

      tmp[row.district] = {
        value: _value,
        number: _number
      };
    }
    j++;
  }

  var k = 1;
  for (var row of bestLowIncomeUnits) {
    if (tmp[row.labelValue] === undefined) {
      tmp[row.labelValue] = {
        value: k,
        number: 1
      };
    } else {
      var _value = tmp[row.labelValue].value + k;
      var _number = tmp[row.labelValue].number + 1;

      tmp[row.labelValue] = {
        value: _value,
        number: _number
      };
    }
    k++;
  }

  for (var row in tmp) {
    var n = 3 - tmp[row].number;
    tmp[row].value = tmp[row].value + 10 * n;

    best3District.push({
      name: row,
      data: tmp[row]
    });
  }
  best3District = sort3Best(best3District).splice(0, 3);
  graph3Best();
}

function sort3Best(array) {
  return array.sort(function(x1, x2) {
    return x1.data.value - x2.data.value;
  });
}

function graph3Best() {
  var best1 = $("#1-best");
  var best2 = $("#2-best");
  var best3 = $("#3-best");
  best1.html(
    abbr[best3District[0].name.split("-")[0]] +
      " - " +
      best3District[0].name.split("-")[1]
  );
  best2.html(
    abbr[best3District[2].name.split("-")[0]] +
      " - " +
      best3District[2].name.split("-")[1]
  );
  best3.html(
    abbr[best3District[1].name.split("-")[0]] +
      " - " +
      best3District[1].name.split("-")[1]
  );
}

//---------------------------------------------
function graphBest() {
  var val = $("input[name=graph-best-10]:checked").val();
  var table = $("#body-best-10")[0];
  var headTable = $("#head-best-10");

  $("#body-best-10").empty();

  var newRow,
    rank,
    borough,
    nDistrict,
    distanceValue,
    valueLowIncomeUnit,
    nCrimes;

  if (val === "Distance") {
    headTable.html(
      `<tr>
        <th colspan="col">#Rank:</th>
        <th colspan="col">Borough:</th>
        <th colspan="col">N° District:</th>
        <th colspan="col">Distance:</th>
      </tr>`
    );
    var i = 1;

    for (var row of bestDistance) {
      newRow = table.insertRow(table.rows.length);
      rank = newRow.insertCell(0);
      borough = newRow.insertCell(1);
      nDistrict = newRow.insertCell(2);
      distanceValue = newRow.insertCell(3);

      rank.innerHTML = i;
      borough.innerHTML = row.elements[0].borough;
      if (row.elements[0].number < 10) {
        nDistrict.innerHTML =
          abbr[row.elements[0].borough] + "-0" + row.elements[0].number;
      } else {
        nDistrict.innerHTML =
          abbr[row.elements[0].borough] + "-" + row.elements[0].number;
      }

      if (row.elements[0].status === "OK") {
        distanceValue.innerHTML = formatDistance(
          row.elements[0].distance.value
        );
      } else {
        distanceValue.innerHTML = "Not Found";
      }

      i++;
    }
  } else if (val === "Affordability") {
    bestLowIncomeUnits = [];
    best10LowIncomeUnits();

    headTable.html(
      `<tr>
        <th colspan="col">#Rank:</th>
        <th colspan="col">Borough:</th>
        <th colspan="col">N° District:</th>
        <th colspan="col">Low Income Unit:</th>
      </tr>`
    );

    var i = 1;
    for (var row of bestLowIncomeUnits) {
      newRow = table.insertRow(table.rows.length);
      rank = newRow.insertCell(0);
      borough = newRow.insertCell(1);
      nDistrict = newRow.insertCell(2);
      valueLowIncomeUnit = newRow.insertCell(3);

      rank.innerHTML = i;
      i++;
      borough.innerHTML = abbr[row.labelValue.split("-")[0]];
      nDistrict.innerHTML = row.labelValue;
      valueLowIncomeUnit.innerHTML = formatLowIncomeUnits(row.average) + " Und";
    }
  } else if (val === "Safety") {
    headTable.html(
      `<tr>
        <th colspan="col">#Rank:</th>
        <th colspan="col">Borough:</th>
        <th colspan="col">N° District:</th>
        <th colspan="col">Number Crimes:</th>
      </tr>`
    );

    var i = 1;
    for (var row of best10CrimesNY) {
      newRow = table.insertRow(table.rows.length);
      rank = newRow.insertCell(0);
      borough = newRow.insertCell(1);
      nDistrict = newRow.insertCell(2);
      nCrimes = newRow.insertCell(3);

      rank.innerHTML = i;
      i++;
      borough.innerHTML = abbr[row.district.split("-")[0]];
      nDistrict.innerHTML = row.district;
      nCrimes.innerHTML = row.number;
    }
  }
}
//---------------------------------------------

function initData() {
  return district_graph.map(function(borough) {
    return { borough: borough.borough, value: borough.value };
  });
}

var district_graph = itemStatistic("average");
var svg = d3
  .select("#graphDistance")
  .append("svg")
  .append("g");

var width = 700,
  height = 400,
  radius = Math.min(width, height) / 2;

svg.append("g").attr("class", "slices");

svg.append("g").attr("class", "labels");
svg.append("g").attr("class", "lines");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.svg
  .arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

var outerArc = d3.svg
  .arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d) {
  return d.data.borough;
};
var color = d3.scale
  .ordinal()
  .domain(district_graph)
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#7573b9"]);

var labelValue = d3.svg
  .arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40);

function graphDistanceD3() {
  var statistic_distance = {
    average: "Average",
    maximum: "Maximum",
    minimum: "Minimum",
    range: "Range",
    stdDeviation: "Standard Deviation"
  };

  var val = $("input[name=graph-statistic]:checked").val();
  $("#title-graph-distance").html(statistic_distance[val]);
  district_graph = val ? itemStatistic(val) : itemStatistic("average");

  change(initData());
  graphBest();
}

function change(data) {
  var slice = svg
    .selectAll(".slices")
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  slice
    .append("path")
    .data(pie(data))
    .attr("fill", function(d) {
      return color(d.data.borough);
    })
    .attr("class", "slice");

  var slice1 = svg
    .selectAll("g.arc")
    .select("path.slice")
    .data(pie(data));

  slice1
    .transition()
    .duration(1000)

    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);

      return function(t) {
        return arc(interpolate(t));
      };
    });

  slice1.exit().remove();

  $(".text-graph").hide();

  var textSlice = svg
    .select(".slices")
    .selectAll(".arc")
    .data(pie(data));

  textSlice

    .append("text")
    .attr("class", "text-graph")
    .text(function(d) {
      return d.data.value;
    })
    .attr("transform", function(d) {
      return "translate(" + labelValue.centroid(d) + ")";
    });

  textSlice.exit().remove();
  for (var i = 0; i < 2; i++) {
    var text = svg
      .select(".labels")
      .selectAll("text")
      .data(pie(data), key);

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function(d) {
        return d.data.borough;
      });

    text
      .transition()
      .duration(1000)
      .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        };
      })
      .styleTween("text-anchor", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    text.exit().remove();

    var polyline = svg
      .select(".lines")
      .selectAll("polyline")
      .data(pie(data), key);

    polyline.enter().append("polyline");

    polyline
      .transition()
      .duration(1000)
      .attrTween("points", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }
}
//---------------------------------------------
var columnsLow,
  svgLow,
  marginLow,
  widthLow,
  heightLow,
  g,
  xLow,
  yLow,
  zLow,
  stackLow;

function dataLowIncomeUnits() {
  var select = $("input[name=graph-statistic-low]:checked").val();

  var data_set = [];

  for (var row in statistic_LowIncomeUnits) {
    if (row === select) {
      var i = 1,
        key;
      for (var row_n in statistic_LowIncomeUnits[row]) {
        if (i < 10) {
          key = row + "-0" + i;
        } else {
          key = row + "-" + i;
        }
        i++;
        data_set.push(statistic_LowIncomeUnits[row][key]);
      }
    }
  }

  $("g#root g").remove();
  graphD3LowIncomeUnits(data_set);
}

function initGraphD3LowIncomeUnits() {
  columnsLow = [
    "labelValue",
    "maximum",
    "average",
    "range",
    "standardDeviation"
  ];

  svgLow = d3.select("svg#graph-lowIncomeUnits");
  marginLow = { top: 20, right: 60, bottom: 30, left: 40 };
  widthLow = +svgLow.attr("width") - marginLow.left - marginLow.right;
  heightLow = +svgLow.attr("height") - marginLow.top - marginLow.bottom;
  $("g#root").remove();
  g = svgLow
    .append("g")
    .attr(
      "transform",
      "translate(" + marginLow.left + "," + marginLow.top + ")"
    )
    .attr("id", "root");

  xLow = d3
    .scaleBand()
    .rangeRound([0, widthLow])
    .padding(0.1)
    .align(0.1);

  yLow = d3.scaleLinear().rangeRound([heightLow, 0]);

  zLow = d3
    .scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

  stackLow = d3.stack().offset(d3.stackOffsetExpand);

  dataLowIncomeUnits();
}

function graphD3LowIncomeUnits(data) {
  if (!data[0]) {
    return;
  }
  xLow.domain(
    data.map(function(d) {
      return d.labelValue;
    })
  );
  zLow.domain(columnsLow.slice(1));

  var serie = g
    .selectAll(".serie")
    .data(stackLow.keys(columnsLow.slice(1))(data))
    .enter()
    .append("g")
    .attr("class", "serie")
    .attr("fill", function(d) {
      return zLow(d.key);
    });

  serie
    .selectAll("rect")
    .data(function(d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xLow(d.data.labelValue);
    })
    .attr("y", function(d) {
      return yLow(d[1]);
    })
    .attr("height", function(d) {
      return yLow(d[0]) - yLow(d[1]);
    })
    .attr("width", xLow.bandwidth());

  g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + heightLow + ")")
    .call(d3.axisBottom(xLow));

  g
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yLow).ticks(10, "%"));

  var legend = serie
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d) {
      var d = d[d.length - 1];
      return (
        "translate(" +
        (xLow(d.data.labelValue) + xLow.bandwidth()) +
        "," +
        (yLow(d[0]) + yLow(d[1])) / 2 +
        ")"
      );
    });

  legend
    .append("line")
    .attr("x1", -6)
    .attr("x2", 6)
    .attr("stroke", "#000");

  legend
    .append("text")
    .attr("x", 9)
    .attr("dy", "0.35em")
    .attr("fill", "#000")
    .style("font", "10px sans-serif")
    .text(function(d) {
      return d.key;
    });
}

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i)
    t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}

//---------------------------------------------

/**
 * MAIN FUNCTION
 */
$(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $("#input-map").on("click", getAndRemoveMap);

  $("#input-home").on("click", housingSearch);

  $("#selectDistrict").on("change", selectDistrict);

  $("#selectNumberDistrict").on("change", graphHousing);

  $("#input-museum").on("click", getDataMuseums);

  $("#input-crimes").on("click", graphCrimes);

  $("#graph-crimes").on("click", graphD3js);

  $("#input-gallery").on("click", graphGallery);

  $(".radio-crimes input").on("change", numberCrimesByDistrict);

  $("#select-table-distance").on("change", updateTableDistancesStatistics);

  $("#select-table-distance").on("change", updateTableDistances);

  $(".input-group-text input").on("change", graphDistanceD3);

  $(".radio-best input").on("change", graphBest);

  $(".radio-low input").on("change", dataLowIncomeUnits);

  $("#select-table-lowIncomeUnits").on("change", updateTableLowIncomeUnits);

  $("#select-distrit-n-lowIncomeUnits").on("change", updateTableLowIncomeUnits);

  $("#select-graph-lowIncomeUnits").on("change", dataLowIncomeUnits);

  $("#graph-neighborhoods a").click(graphNeighborhoods);

  $("#select-distrit-n-lowIncomeUnits").hide();

  $("#export-table-distance").click(function() {
    $("#table-distance-district").tableToCSV();
  });

  $("#content-crimes-table").hide();

  getDataCrimes();
  getDataHousing();
  getDataNeighborhood();
  getNeighborhoods();
  getDataGallery();
  graphLowIncomeUnits();

  setTimeout(function() {
    bestCrimes();
    best10Crimes();
    best3();
    numberCrimesByDistrict();
  }, 5000);
});
