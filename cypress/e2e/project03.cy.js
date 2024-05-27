import BookingFunction from "../pages/Proj03"

const bookingFunction = new BookingFunction

function addDaysToDate(daysToAdd) {
  let currentDate = new Date()
  let newDate = new Date(currentDate)
  newDate.setDate(newDate.getDate() + daysToAdd)
  return newDate
}

describe('Homework03 - Cypress-Project-03', () => {
  beforeEach(() => {
    cy.visit('https://techglobal-training.com/frontend/project-3')

    cy.fixture('bookingFunction').then(function (data) {
      this.DefaultData = data.DefaultData 
      this.NumberOfPassengersDefault = data.NumberOfPassengersDefault 
      this.Passenger1Default = data.Passenger1Default
  
    })
    cy.fixture('bookingFunction').as('ticketData')
  })


  it('Test Case 01 - Validate the default Book your trip form', () => {

    bookingFunction.getOneWayRoundTripRadioButton().each(($el) => {
      cy.wrap($el).find('input').should('be.visible').and('be.enabled')
      cy.log($el.text())

      if ($el.text().includes('One way')) cy.wrap($el).find('input').should('be.checked')
      else if ($el.text().includes('Round trip')) cy.wrap($el).find('input').should('not.be.checked')
    })

    bookingFunction.getLables().each(function ($el, index) {
      cy.wrap($el)
        .should('be.visible')
        .next()
        .and('be.visible')
      if ($el.text().includes('Return'))
        cy.wrap($el).next().find('input').should('have.attr', 'disabled')

      if ($el.text().includes('Number of passengers') || $el.text().includes('Passenger 1'))
        cy.wrap($el)
          .next()
          .find('option')
          .should('have.value', this.DefaultData[index - 6])
    })
  })

  it('Test Case 02 - Validate the Book your trip form when Round trip is selected', () => {

    bookingFunction.getOneWayRoundTripRadioButton().last().click()

    bookingFunction.getOneWayRoundTripRadioButton().each(($el) => {
      cy.wrap($el)
        .find('input')
        .should('be.visible')
        .and('be.enabled')
      cy.log($el.text())

      if ($el.text().includes('One way')) cy.wrap($el).find('input').should('not.be.checked')
      else if ($el.text().includes('Round trip')) cy.wrap($el).find('input').should('be.checked')
    })

    bookingFunction.getLables().each(function ($el, index) {
      cy.wrap($el)
        .should('be.visible')
        .next()
        .and('be.visible')

      if ($el.text().includes('Number of passengers') || $el.text().includes('Passenger 1'))
        cy.wrap($el)
          .next()
          .find('option')
          .should('have.value', this.DefaultData[index - 6])
    })

  })

  const testC = ['Test Case 03 - Validate the booking for 1 passenger and one way', 
  'Test Case 04 - Validate the booking for 1 passenger and round trip', 
  'Test Case 05 - Validate the booking for 2 passengers and one way']

  for (let i = 0; i < testC.length; i++) {
    it(`${testC[i]}`, function () {
      cy.get('@ticketData').then((tData) => {
        const ticket = tData.Ticket
        bookingFunction.getPassenger(Number(ticket[i][6]))
        bookingFunction.getLables().each(function ($el, index) {
          cy.wrap($el)
          if ($el.text().includes('Trip type') && ticket[i][index] === 'One way')
            bookingFunction.getOneWayRoundTripRadioButton()
              .first()
              .click()
          else if ($el.text().includes('Trip type') && ticket[i][index] === 'Round trip')
            bookingFunction.getOneWayRoundTripRadioButton()
              .last()
              .click()

          if (!($el.text().includes('Trip type') || $el.text().includes('Depart') || $el.text().includes('Return'))) {
            cy.wrap($el)
              .next()
              .click()
              .find('select')
              .select(`${ticket[i][index]}`)
          }
          if ($el.text().includes('Depart')) {

            cy.wrap($el)
              .next()
              .clear()
              .type(`${addDaysToDate(Number(ticket[i][index]))}{Enter}`)
          }
          if ($el.text().includes('Return') && ticket[i][index] !== '') {

            cy.wrap($el)
              .next()
              .find('input')
              .clear()
              .type(`${addDaysToDate(Number(ticket[i][index]))}{Enter}`)
          }
        })

        bookingFunction.getBookingButton().click()
        bookingFunction.getDep().should('be.visible')
        bookingFunction.getDep().next().should('be.visible')
        bookingFunction.getRes().each(function ($el, index) {
          if ($el.text().includes('Number of Passengers')) cy.wrap($el).should('include.text', `${ticket[i][6]}`)
          if ($el.text().includes('Passenger ')) cy.wrap($el).should('include.text', `${ticket[i][6 + index]}`)
          if ($el.text().includes('Cabin Class')) cy.wrap($el).should('include.text', `${ticket[i][1]}`)

        })

      })

    })
  }
})