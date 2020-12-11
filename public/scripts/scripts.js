function myFunction() {
  vselect = true;
  var x = document.getElementById("chamber").value;
  console.log(x)
  if (x == "senate") {
    document.getElementById("session").innerHTML = "<option>116</option><option>115</option><option>114</option><option>113</option><option>112</option><option>111</option><option>110</option><option>109</option><option>108</option><option>107</option><option>106</option><option>105</option><option>104</option><option>103</option><option>102</option><option>101</option><option>100</option><option>99</option><option>98</option><option>97</option><option>96</option><option>95</option><option>94</option><option>93</option><option>92</option><option>91</option><option>90</option><option>89</option><option>88</option><option>87</option><option>86</option><option>85</option><option>84</option><option>83</option><option>82</option><option>81</option><option>80</option>";
  } else {
    document.getElementById("session").innerHTML = "<option>116</option><option>115</option><option>114</option><option>113</option><option>112</option><option>111</option><option>110</option><option>109</option><option>108</option><option>107</option><option>106</option><option>105</option><option>104</option><option>103</option><option>102</option>";
  }
}


$(document).ready(function() {
  $(".my_button").click(function(event) {
    var cong = event.target.id.split("_")[1];
    var first = event.target.id.split("_")[2];
    var last = event.target.id.split("_")[3];

    var apiKey = '';
    var requestURL = "https://api.propublica.org/congress/v1/members/"+cong+"/bills/introduced.json";

    $.ajax({
      url: requestURL,
      type: "GET",
      dataType: 'json',
      headers: {
        'X-API-Key': "6aJgKYySoFvQsmKndOCSozMMIloNWAQVU8IwjWBL"
      }

    }).done(function(data) {
      var content = "";
      for (var i=0; i<data.results[0].bills.length; i++) {
        var bill = data.results[0].bills[i];
        var short = bill.short_title;
        var full = bill.title;

        if (short==null){
          short = full;
        }

        content += "<div class='text-dark card'><div class='text-dark card-header text-truncate' id='heading"+i+"'><h5 class='text-dark mb-0'><button class='text-dark btn btn-link collapsed' data-toggle='collapse' data-target='#collapse"+i+"' aria-expanded='true' aria-controls='collapse"+i+"'>"+short+"</button></h5></div>"
        content += "<div id='collapse"+i+"' class='text-dark collapse' aria-labelledby='heading"+i+"' data-parent='#accordion'><div class='card-body'>"+full+"</div></div></div>"
      }

      if (data.results[0].bills.length == 0) {
          content += "There are no bills to be shown here. This is probably because the ProPublica API has limited data on bills for Congressional sessions prior to 2013. See more information about the bills database <a target='_blank' href ='https://projects.propublica.org/api-docs/congress-api/bills/#get-recent-bills-by-a-specific-member'>here</a>";
      }

      var topcontent = "";
      topcontent = "<div class='modal-header'> <h5 class='modal-title text-dark'>Bills Sponsored by " +first+" "+last+"</h5></div>";
      $('#headBill').html(topcontent);
      $('#bills').html(content);

    });
  });
});
