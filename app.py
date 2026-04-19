from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB Server Connection (Localhost)
client = MongoClient('mongodb://localhost:27017/')
db = client['job_portal_db']
jobs_collection = db['jobs']

@app.route('/')
def index():
    return render_template('index.html')

# CREATE: MongoDB mein job add karne ke liye
@app.route('/api/jobs', methods=['POST'])
def add_job():
    data = request.json
    job_entry = {
        'company': data.get('company'),
        'title': data.get('title'),
        'salary': data.get('salary'),
        'location': data.get('location'),
        'skills': data.get('skills'),
        'description': data.get('description')
    }
    result = jobs_collection.insert_one(job_entry)
    job_entry['_id'] = str(result.inserted_id)
    return jsonify(job_entry), 201

# READ: Saare jobs server se laane ke liye
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = []
    for job in jobs_collection.find():
        job['_id'] = str(job['_id'])
        jobs.append(job)
    return jsonify(jobs), 200

# DELETE: Specific job delete karne ke liye
@app.route('/api/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    result = jobs_collection.delete_one({'_id': ObjectId(job_id)})
    if result.deleted_count:
        return jsonify({'message': 'Job deleted'}), 200
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)