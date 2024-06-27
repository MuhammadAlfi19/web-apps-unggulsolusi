export const formatRupiah = (number) => {

    // var removeChar = number.replace(/[^0-9\.]/g,'')

    // var removeDot = removeChar.replace(/\./g,'');

    // var formatedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g,",");

    // return formatedNumber;
    var removeChar = number.replace(/[^0-9\.]/g,'') // This is to remove alphabets and special characters.
    // console.log(removeChar);
    var removeDot = removeChar.replace(/\./g,'') // This is to remove "DOT"
    number = removeDot

    var formatedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g,",")
    // console.log(formatedNumber);
    return formatedNumber
};


