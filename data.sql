-- Use the 'jharkhand' database
USE jharkhand;

-- Insert sample data into the 'places' table
INSERT INTO `places` (`id`, `name`, `district`, `category`, `description`, `image_url`) VALUES
(1, 'Dassam Falls', 'Ranchi', 'waterfall', 'A spectacular waterfall located near Taimara village in Ranchi district.', 'https://via.placeholder.com/300'),
(2, 'Betla National Park', 'Palamu', 'wildlife', 'A beautiful national park which is home to a wide variety of wildlife.', 'https://via.placeholder.com/300'),
(3, 'Netarhat', 'Latehar', 'historical', 'A hill station in Latehar district, also known as the "Queen of Chotanagpur".', 'https://via.placeholder.com/300'),
(4, 'Hundru Falls', 'Ranchi', 'waterfall', 'One of the highest waterfalls in the state, created on the course of the Subarnarekha River.', 'https://via.placeholder.com/300'),
(5, 'Patratu Valley', 'Ramgarh', 'scenic', 'Famous for its scenic beauty and winding roads, a popular spot for tourists.', 'https://via.placeholder.com/300');

-- Insert sample data into the 'vendors' table
INSERT INTO `vendors` (`id`, `name`, `category`, `latitude`, `longitude`, `image_url`, `description`, `contact`) VALUES
(1, 'Jharkhand Handloom & Handicrafts', 'handloom', 23.3441, 85.3096, 'https://via.placeholder.com/300', 'A store showcasing a wide range of local handloom products.', 'contact@jharkhandhandloom.com'),
(2, 'Paitkar Paintings of Amadubi', 'handicrafts', 22.7041, 86.1957, 'https://via.placeholder.com/300', 'Authentic Paitkar paintings from local artisans in Amadubi village.', 'info@paitkaramadubi.com'),
(3, 'Ranchi Street Food Corner', 'street-food', 23.3441, 85.3096, 'https://via.placeholder.com/300', 'A popular spot for trying out local street food delicacies of Jharkhand.', '9876543210'),
(4, 'Tribal Crafts Emporium', 'handicrafts', 23.3441, 85.3096, 'https://via.placeholder.com/300', 'An emporium for authentic tribal crafts and souvenirs.', 'support@tribalcrafts.com');