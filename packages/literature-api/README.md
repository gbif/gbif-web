# A wrapper the Elastic Search literature API

GET style parameters are transformed into POST style first. That simplifies the processing.
There is no mixing allowed. then object style takes priority
GET or POST
GET takes both post body as well as more familiar rest parameters
For nested fields (where relations are in place. e.g. first name and last name of an author), then I'm not sure what to do for REST type params.

* Group with postfix? `author_1.firstName=Ann & author_1.lastName=Anderson`
* Group by ordering: `author.firstName=Ann & author.firstName=Ben & author.lastName=Anderson & author.lastName=Benson`
* Group by arrays: `author=["Ann","Anderson"] & author=["Ben", "Benson"]`
* Group by some delimiter (how to avoid conflicts?): `author=Ann__Anderson`
* Group by JSON: `author={"firstName":"Ann","lastName":"Anderson"}`

in POST it would be
[ // AND
  {
    key: author
    value: [ //OR
      {
        firstName: ann
        lastName: Anderson
      },
      {
        firstName: Ben
        lastName: Benson
      }
    ]
  }
]

and if we wanted an AND
[ // AND
  {
    key: author
    value: {
      firstName: Ann
      lastName: Anderson
    }
  },
  {
    key: author
    value: {
      firstName: Bem
      lastName: Benson
    }
  }
]