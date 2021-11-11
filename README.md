# API 

<a name="Database"></a>

## Database
Class wrapping database operations.

**Kind**: global class  

* [Database](#Database)
    * [.connect(url)](#Database.connect)
    * [.db(dbName)](#Database.db) ⇒ <code>database</code>
    * [.close()](#Database.close)
    * [.store_user(body)](#Database.store_user)
    * [.read_user(username)](#Database.read_user) ⇒ <code>User</code>
    * [.read_activeHubs()](#Database.read_activeHubs) ⇒ <code>Array.&lt;Hub&gt;</code>
    * [.read_nearbyHubs(loc, radius)](#Database.read_nearbyHubs) ⇒ <code>Array.&lt;Hub&gt;</code>
    * [.read_hub(hubId)](#Database.read_hub) ⇒ <code>Hub</code>
    * [.store_hub(body)](#Database.store_hub)
    * [.schedule_jobs()](#Database.schedule_jobs)
    * [.read_assignedJobs(username)](#Database.read_assignedJobs) ⇒ <code>Array.&lt;Job&gt;</code>
    * [.read_job(jobId)](#Database.read_job) ⇒ <code>Job</code>
    * [.store_job(body)](#Database.store_job)
    * [.read_maxMaxJobId()](#Database.read_maxMaxJobId) ⇒ <code>number</code>
    * [.read_maxMaxHubId()](#Database.read_maxMaxHubId) ⇒ <code>number</code>

<a name="Database.connect"></a>

### Database.connect(url)
Connect the database

**Kind**: static method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url for the database |

<a name="Database.db"></a>

### Database.db(dbName) ⇒ <code>database</code>
Database wrapper

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>database</code> - - Database for MongoDB operations.  

| Param | Type | Description |
| --- | --- | --- |
| dbName | <code>string</code> | Name of the database. |

<a name="Database.close"></a>

### Database.close()
Close the connection

**Kind**: static method of [<code>Database</code>](#Database)  
<a name="Database.store_user"></a>

### Database.store\_user(body)
Stores a user

**Kind**: static method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>User</code> | JSON of a user file. |

<a name="Database.read_user"></a>

### Database.read\_user(username) ⇒ <code>User</code>
Reads a user

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>User</code> - - JSON of the requested user file.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Username of the requested user. |

<a name="Database.read_activeHubs"></a>

### Database.read\_activeHubs() ⇒ <code>Array.&lt;Hub&gt;</code>
Returns all currently active hubs.

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>Array.&lt;Hub&gt;</code> - - Array of JSON of currently active hubs.  
<a name="Database.read_nearbyHubs"></a>

### Database.read\_nearbyHubs(loc, radius) ⇒ <code>Array.&lt;Hub&gt;</code>
Reads nearby hubs

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>Array.&lt;Hub&gt;</code> - - Array of JSON of hubs satisfying the query.  

| Param | Type | Description |
| --- | --- | --- |
| loc | <code>coordinates</code> | Cordinates of the center of the search. |
| radius | <code>number</code> | Radius of the search in miles. |

<a name="Database.read_hub"></a>

### Database.read\_hub(hubId) ⇒ <code>Hub</code>
Reads a hub

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>Hub</code> - - JSON of the requested hub.  

| Param | Type | Description |
| --- | --- | --- |
| hubId | <code>number</code> | ID of the requested hub. |

<a name="Database.store_hub"></a>

### Database.store\_hub(body)
Stores a hub

**Kind**: static method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Hub</code> | JSON of a hub file. |

<a name="Database.schedule_jobs"></a>

### Database.schedule\_jobs()
Schedule unassigned jobs that are within 1 hr from scheduled time.

**Kind**: static method of [<code>Database</code>](#Database)  
<a name="Database.read_assignedJobs"></a>

### Database.read\_assignedJobs(username) ⇒ <code>Array.&lt;Job&gt;</code>
Reads jobs assigned to a driver and assign jobs using schedule_jobs.

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>Array.&lt;Job&gt;</code> - - Array of JSON of jobs assigned to the driver.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Username of the requested driver. |

<a name="Database.read_job"></a>

### Database.read\_job(jobId) ⇒ <code>Job</code>
Reads a job and assign jobs using schedule_jobs.

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>Job</code> - - JSON of the requested job.  

| Param | Type | Description |
| --- | --- | --- |
| jobId | <code>number</code> | ID of the requested job. |

<a name="Database.store_job"></a>

### Database.store\_job(body)
Stores a job

**Kind**: static method of [<code>Database</code>](#Database)  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Job</code> | JSON of a job file. |

<a name="Database.read_maxMaxJobId"></a>

### Database.read\_maxMaxJobId() ⇒ <code>number</code>
Reads the currect maximum jobId

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>number</code> - - Currect maximum jobId.  
<a name="Database.read_maxMaxHubId"></a>

### Database.read\_maxMaxHubId() ⇒ <code>number</code>
Reads the currect maximum hubId

**Kind**: static method of [<code>Database</code>](#Database)  
**Returns**: <code>number</code> - - Currect maximum hubId.  
