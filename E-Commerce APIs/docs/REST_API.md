## REST API

## Understanding API
### Problems with MVC
1. Complexity: MVC can become complex as the application grows, making it
difficult to maintain and understand the code.
2. Tight coupling: Components in MVC can be tightly coupled, making it
challenging to modify one component without affecting others.
3. Difficulty in making changes: Due to the complex and tightly coupled nature
of MVC, making changes to the application can be difficult.
4. Difficulty in scaling: As the application grows, scaling an MVC architecture
can pose challenges.
<img src="./images/tight_coupling.png" alt="Add New-Product View" width="500" height="auto">

### API (Application Programming Interface)
APIs are different from MVC in terms of how they handle data. In MVC, the server
typically renders views and sends them to the client, which includes both the
structure and data to be displayed. On the other hand, APIs primarily focus on
sending data instead of views.
- APIs provide a solution to the problems of tightly-coupled systems in MVC
applications.
- APIs separate the frontend and backend components, allowing them to
communicate through a well-defined interface.
- APIs enable easier modification of individual components without impacting
the entire system.
- APIs promote code reusability and facilitate the use of existing services and
data from other applications
<img src="./images/loose_coupling.png" alt="Add New-Product View" width="500" height="auto">

### Types of APIs
SOAP (Simple Object Access Protocol): A protocol for exchanging structured
information in web services. It uses XML and relies on transport protocols like
HTTP or SMTP.
- REST (Representational State Transfer): An architectural style for designing
networked applications. It uses HTTP methods (GET, POST, PUT, DELETE)
to perform operations on resources identified by URIs. RESTful APIs are easy
to build, maintain, and scale.
- GraphQL: A query language and runtime for APIs. It allows clients to request
only the data they need, making it more efficient than traditional REST APIs.
GraphQL can also aggregate data from multiple source
<img src="./images/api_types.png" alt="Add New-Product View" width="600" height="auto">


