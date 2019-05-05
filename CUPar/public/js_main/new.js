$(document).ready(function () {
    $("#College").change(function () {
        var val = $(this).val();
        if (val == "CC") {
            $("#Hall").html("<option value='HL'>Hua Lien Tang</option><option value='LSP'>Lee Shu Pui Hall</option><option value='MSH'>Madam SH Ho Hall</option><option value='MH'>Ming Hua Tang</option><option value='PMH'>Pentecostal Mission Hall(High)</option><option value='PML'>Pentecostal Mission Hall(Low)</option><option value='TB'>Theology Building</option><option value='WC'>Wen Chih Tang</option><option value='WL'>Wen Lin Tang</option><option value='YL'>Ying Lin Tang</option>");
        } else if (val == "NA") {
            $("#Hall").html("<option value='CH'>Chih Hsing Hall</option><option value='XS'>Xuesi Hall</option><option value='GT'>Grace Tien Hall</option><option value='DL'>Daisy Li Hall</option>");
        } else if (val == "UC") {
            $("#Hall").html("<option value='AS'>Adam Schall Residence</option><option value='BH'>Bethlehem Hall</option><option value='CCH'>Chan Chun Ha Hostel</option><option value='HS'>Hang Seng Hall</option>");
        } else if (val == "Shaw") {
            $("#Hall").html("<option value='KM'>Kuo Mou Hall</option><option value='SH2'>Student Hostel 2</option>");
        } else if (val == "SHHo") {
            $("#Hall").html("<option value='LQW'>Lee Quo Wei Hall</option><option value='HT'>Ho Tim Hall</option>");
        } else if (val == "MC") {
            $("#Hall").html("<option value='MC'>Morningside College</option>");
        } else if (val == "CW") {
            $("#Hall").html("<option value='CW'>C.W.Chu College</option>");
        } else if (val == "WYS") {
            $("#Hall").html("<option value='WYS'>Wu Yee Sun College</option>");
        } else if (val == "WS") {
            $("#Hall").html("<option value='WS'>Lee Woo Sing College</option>");
        } else if (val == "item0") {
            $("#Hall").html("<option value=''>--select one--</option>");
        }
    });
});