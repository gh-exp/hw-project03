class BookingFunction {

  getOneWayRoundTripRadioButton() {
    return cy.get('.radio')
  }

  getLables() {
    return cy.get('.label')
  }

  getRes() {
    return cy.get('.mt-4 > p')
  }

  getBookingButton() {
    return cy.get('.Button_c_button__TmkRS')
  }

  getDep() {
    return cy.get('.is-italic')
  }

  getPassenger(index) {
    return cy.get('.select').eq(3).find('select').select(`${index}`)
  }
}


export default BookingFunction