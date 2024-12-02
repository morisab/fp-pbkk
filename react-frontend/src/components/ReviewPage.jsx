import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled-components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReviewCard = styled.div`
  max-width: 400px;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 2px solid red;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  text-align: center;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: medium;
  color: #4a5568;
`;

const RatingLabel = styled(Label)`
  font-size: 1rem;
`;

const CommentLabel = styled(Label)`
  font-size: 1rem;
`;

const RatingWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RadioButton = styled.input`
  margin-right: 0.25rem;
`;

const TextArea = styled.textarea`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #68d391;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #2f855a;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #38a169;
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0); // Store rating as a number
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      alert("Please provide a rating and a comment.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:3000/api/orders/${id}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Review berhasil dikirim!");
      navigate("/orders-history"); // Redirect to orders history
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Gagal mengirim review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ReviewCard>
        <Title>Review Order #{id}</Title>
        <form onSubmit={submitReview}>
          <div style={{ marginBottom: "1rem" }}>
            <RatingLabel>Rating:</RatingLabel>
            <RatingWrapper>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center">
                  <RadioButton
                    type="radio"
                    value={num}
                    checked={rating === num} // Compare numbers
                    onChange={() => setRating(num)} // Set as number directly
                    required
                  />
                  <span>{num}</span>
                </label>
              ))}
            </RatingWrapper>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <CommentLabel>Comment:</CommentLabel>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength="255"
              rows="4"
              required
            />
          </div>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Review"}
          </SubmitButton>
        </form>
      </ReviewCard>
    </Container>
  );
};

export default ReviewPage;
