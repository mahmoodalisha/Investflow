## NexaChain: Decentralized Investment & Referral Platform
NexaChain is a high-performance, full-stack financial application designed for automated investment management and multi-level marketing (MLM) commission distribution. The platform automates daily ROI calculations and ensures transparent, real-time commission tracking across an infinite-depth referral network.

## Key Features
- Automated ROI Engine: A secure cron-job system that processes active investments and credits ROI daily.

- MLM Commission Engine: An infinite-level referral logic that triggers instant payouts based on a defined commission structure.

- Real-time Dashboard: A data-driven UI showing wallet balances, investment performance, and dynamic trend charts.

- Network Visualization: An interactive, recursive tree structure for tracking downline growth.

- Secure Auth: JWT-based authentication system with route protection.

## Architecture
* Frontend: React.js, Tailwind CSS, Recharts, Lucide-React.
* Backend: Node.js, Express.js.
* Database: MongoDB with Mongoose (Aggregation pipelines for analytics).

## Network Hierarchy (Referral Tree)
The system supports infinite-depth referral tracking. Below is an example of the current live network hierarchy:

```
[Alice - Root Node]
  │
  └── [Bob - Level 1]
        │
        ├── [Carol - Level 2]
        │     │
        │     └── [Max - Level 3]
        │
        └── [Charles - Level 2]
              │
              ├── [Caroline - Level 3]
              │     │
              │     └── [Sophie - Level 4]
              │
              └── [Oleg - Level 3]
            
```
## API Endpoints Reference

```
POST  http://localhost:5000/api/auth/register
POST  http://localhost:5000/api/auth/login
```

Investments APIs
```
POST /api/investments/ - Create a new investment (triggers commission engine).
GET /api/investments/ - Fetch all investments for the logged-in user.
POST /api/investments/trigger-roi - Manual trigger for the ROI distribution logic.
GET /api/investments/roi-history - Full ledger of all credited returns.
```
Referral APIs
```
GET /api/referrals/direct - List all direct downline members.
GET /api/referrals/tree - Fetch the full recursive referral network structure.
GET /api/referrals/income - Ledger of commission earnings from the network.
```

### Backend Logic Highlights
The MLM engine uses a while loop to traverse the user hierarchy upwards. For every investment, the system checks the referredBy field, calculates commission based on the COMMISSION_RATES object, and updates the parent’s walletBalance while logging a ReferralIncome receipt.

### Automated ROI Cron Job
- The system utilizes a time-based trigger that:
- Filters for all ACTIVE investments.
- Calculates the daily percentage based on plan configuration.
- Updates the ROIHistory model with PROCESSED status.
- Distributes funds directly to the user’s wallet balance.

### How to Run Locally
Clone the repo:
```
git clone https://github.com/mahmoodalisha/Investflow.git
```
Setup Environment Variables: Create a .env file in the root directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
```
Install Dependencies:
```
npm install
```
Run Server:
```
npm start
```

Built with passion by Mahmood Alisha.