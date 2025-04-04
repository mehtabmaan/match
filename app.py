import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.neighbors import NearestNeighbors
import numpy as np

def load_data(file_path):
    df = pd.read_csv(file_path)
    return df

def preprocess_data(df):
    features_to_encode = ['Gender', 'Lifestyle', 'Personality Type', 'Interests', 'Sleeping Habits',
                          'Pet Preferences', 'Smoking Preference', 'Drinking Preferences', 'Cooking']
    
    encoder = OneHotEncoder(handle_unknown='ignore')
    encoded_features = encoder.fit_transform(df[features_to_encode]).toarray()
    
    X = np.hstack((df[['Age']].values, encoded_features))
    
    knn_model = NearestNeighbors(n_neighbors=5, metric='cosine')
    knn_model.fit(X)
    
    return encoder, knn_model, X, df

def find_similar_users(user_input, encoder, knn_model, df):
    user_encoded = encoder.transform([user_input[:-1]]).toarray()
    user_vector = np.hstack(([user_input[-1]], user_encoded[0]))
    
    distances, indices = knn_model.kneighbors([user_vector])
    
    similar_users = []
    for i in range(len(indices[0])):
        similar_user = df.iloc[indices[0][i]]
        similarity_percentage = (1 - distances[0][i]) * 100  # Convert distance to percentage similarity
        similar_users.append((similar_user, similarity_percentage))
    
    similar_users.sort(key=lambda x: x[1], reverse=True)  # Sort in descending order of similarity
    
    return similar_users

def main():
    file_path = "dataset.csv"
    df = load_data(file_path)
    encoder, knn_model, X, df = preprocess_data(df)
    
    user_input = input("Enter your details as comma-separated values (Gender, Lifestyle, Personality Type, Interests, Sleeping Habits, Pet Preferences, Smoking Preference, Drinking Preferences, Cooking, Age):\n").split(',')
    user_input[-1] = int(user_input[-1])  # Convert age to integer
    
    similar_users = find_similar_users(user_input, encoder, knn_model, df)
    print("Top 5 Similar Users:")
    for i, (user, similarity) in enumerate(similar_users, start=1):
        print(f"{i}. {user['Name']} - Similarity: {similarity:.2f}%")
        print(user, "\n")

if __name__ == "__main__":
    main()
